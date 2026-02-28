/**
 * AlertService - Sends Telegram Bot alerts to node operators
 * when their nodes need attention.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export class AlertService {
  private async sendMessage(chatId: number | string, text: string): Promise<boolean> {
    try {
      const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
        signal: AbortSignal.timeout(10000),
      })
      return res.ok
    } catch (err) {
      console.error(`[AlertService] Failed to send message to ${chatId}:`, err)
      return false
    }
  }

  async sendNodeOfflineAlert(chatId: number | string, nodeId: string, nodeName: string): Promise<void> {
    const msg = [
      `<b>Node Offline Alert</b>`,
      ``,
      `Your node <b>${escapeHtml(nodeName)}</b> (<code>${escapeHtml(nodeId)}</code>) has gone offline.`,
      ``,
      `Please check your node and restart it to continue earning TON rewards.`,
      ``,
      `Open CocoonPulse to view details.`,
    ].join('\n')

    await this.sendMessage(chatId, msg)
  }

  async sendTemperatureAlert(chatId: number | string, nodeId: string, nodeName: string, temp: number): Promise<void> {
    const msg = [
      `<b>High Temperature Alert</b>`,
      ``,
      `Your node <b>${escapeHtml(nodeName)}</b> (<code>${escapeHtml(nodeId)}</code>) is running at <b>${temp}°C</b>.`,
      ``,
      `Consider improving cooling or reducing workload to prevent hardware damage.`,
    ].join('\n')

    await this.sendMessage(chatId, msg)
  }

  async sendEarningsDropAlert(chatId: number | string, todayEarnings: number, avgEarnings: number): Promise<void> {
    const pctDrop = avgEarnings > 0 ? ((avgEarnings - todayEarnings) / avgEarnings * 100).toFixed(1) : '100.0'
    const msg = [
      `<b>Earnings Drop Alert</b>`,
      ``,
      `Today's earnings (${todayEarnings.toFixed(3)} TON) are <b>${pctDrop}% below</b> your daily average (${avgEarnings.toFixed(3)} TON).`,
      ``,
      `Check if all your nodes are online and running optimally.`,
    ].join('\n')

    await this.sendMessage(chatId, msg)
  }

  async sendTeeFailureAlert(chatId: number | string, nodeId: string, nodeName: string): Promise<void> {
    const msg = [
      `<b>TEE Attestation Failed</b>`,
      ``,
      `Your node <b>${escapeHtml(nodeName)}</b> (<code>${escapeHtml(nodeId)}</code>) failed TEE attestation.`,
      ``,
      `This may prevent your node from receiving sensitive AI workloads. Please check your TEE configuration.`,
    ].join('\n')

    await this.sendMessage(chatId, msg)
  }
}

export const alertService = new AlertService()
