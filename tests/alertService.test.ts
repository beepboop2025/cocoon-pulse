import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { AlertService } from '../server/services/alertService'

type SentBody = { chat_id: number | string; text: string; parse_mode: string }

// Capture the JSON body of each Telegram sendMessage call.
function installFetchSpy(ok = true) {
  const calls: { url: string; body: SentBody }[] = []
  const spy = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(init.body as string) })
    return { ok } as Response
  })
  vi.stubGlobal('fetch', spy)
  return { calls, spy }
}

describe('AlertService', () => {
  let svc: AlertService

  beforeEach(() => {
    svc = new AlertService()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('POSTs to the Telegram sendMessage endpoint with HTML parse mode', async () => {
    const { calls } = installFetchSpy()
    await svc.sendNodeOfflineAlert(12345, 'node-1', 'My Node')

    expect(calls).toHaveLength(1)
    expect(calls[0].url).toContain('/sendMessage')
    expect(calls[0].body.chat_id).toBe(12345)
    expect(calls[0].body.parse_mode).toBe('HTML')
  })

  it('escapes HTML metacharacters in node names to prevent markup injection', async () => {
    const { calls } = installFetchSpy()
    await svc.sendNodeOfflineAlert('chat', 'id&<x>', '<script>alert(1)</script>')

    const text = calls[0].body.text
    expect(text).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(text).toContain('id&amp;&lt;x&gt;')
    // raw, unescaped angle brackets from user input must not survive
    expect(text).not.toContain('<script>')
  })

  it('embeds the temperature value in the high-temp alert', async () => {
    const { calls } = installFetchSpy()
    await svc.sendTemperatureAlert(1, 'n', 'Hot Node', 92)
    expect(calls[0].body.text).toContain('92°C')
    expect(calls[0].body.text).toContain('High Temperature Alert')
  })

  it('computes the earnings-drop percentage against the average', async () => {
    const { calls } = installFetchSpy()
    // today 4, avg 8 -> 50.0% below
    await svc.sendEarningsDropAlert(1, 4, 8)
    expect(calls[0].body.text).toContain('50.0% below')
    expect(calls[0].body.text).toContain('4.000 TON')
    expect(calls[0].body.text).toContain('8.000 TON')
  })

  it('reports a 100% drop when the average is zero (no divide-by-zero)', async () => {
    const { calls } = installFetchSpy()
    await svc.sendEarningsDropAlert(1, 0, 0)
    expect(calls[0].body.text).toContain('100.0% below')
  })

  it('escapes identifiers in the TEE failure alert', async () => {
    const { calls } = installFetchSpy()
    await svc.sendTeeFailureAlert(1, 'n<1>', 'Node & Co')
    const text = calls[0].body.text
    expect(text).toContain('TEE Attestation Failed')
    expect(text).toContain('n&lt;1&gt;')
    expect(text).toContain('Node &amp; Co')
  })

  it('swallows network errors and does not throw to the caller', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      }),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(svc.sendNodeOfflineAlert(1, 'n', 'N')).resolves.toBeUndefined()
  })
})
