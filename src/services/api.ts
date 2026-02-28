const BASE_URL = '/api'

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchNodes(walletAddress: string) {
  const res = await fetchWithTimeout(`${BASE_URL}/nodes?wallet=${encodeURIComponent(walletAddress)}`)
  return res.json()
}

export async function fetchEarnings(walletAddress: string, period: string) {
  const res = await fetchWithTimeout(`${BASE_URL}/earnings?wallet=${encodeURIComponent(walletAddress)}&period=${period}`)
  return res.json()
}

export async function fetchNetworkStats() {
  const res = await fetchWithTimeout(`${BASE_URL}/network/stats`)
  return res.json()
}

export async function registerNode(walletAddress: string, nodeId: string) {
  const res = await fetchWithTimeout(`${BASE_URL}/nodes/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, nodeId }),
  })
  return res.json()
}

export async function exportEarningsCsv(walletAddress: string): Promise<Blob> {
  const res = await fetchWithTimeout(`${BASE_URL}/earnings/export?wallet=${encodeURIComponent(walletAddress)}`)
  return res.blob()
}

export async function updateAlertPreferences(walletAddress: string, prefs: Record<string, unknown>) {
  const res = await fetchWithTimeout(`${BASE_URL}/settings/alerts`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, ...prefs }),
  })
  return res.json()
}
