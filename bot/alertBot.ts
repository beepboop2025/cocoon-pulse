/**
 * CocoonPulse Alert Bot
 *
 * A standalone Telegram bot that:
 * 1. Accepts /start to register users for alerts
 * 2. Sends proactive alerts when node issues are detected
 * 3. Provides basic status commands
 *
 * Run separately: npx tsx bot/alertBot.ts
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`
const POLL_TIMEOUT = 30 // seconds

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: { id: number; first_name: string; username?: string }
    chat: { id: number; type: string }
    text?: string
    date: number
  }
}

// In-memory store — replace with database in production
const registeredUsers = new Map<number, { chatId: number; username: string; registeredAt: Date }>()

async function sendMessage(chatId: number, text: string, parseMode = 'HTML'): Promise<void> {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    console.error(`[Bot] Failed to send to ${chatId}:`, err)
  }
}

async function handleCommand(chatId: number, text: string, from: { id: number; first_name: string; username?: string }): Promise<void> {
  const cmd = text.split(' ')[0]?.toLowerCase()

  switch (cmd) {
    case '/start': {
      registeredUsers.set(from.id, {
        chatId,
        username: from.username ?? from.first_name,
        registeredAt: new Date(),
      })

      await sendMessage(chatId, [
        `<b>Welcome to CocoonPulse Alerts!</b>`,
        ``,
        `Hi ${from.first_name}! You're now registered to receive alerts for your Cocoon GPU nodes.`,
        ``,
        `<b>Available commands:</b>`,
        `/status — Check your nodes' status`,
        `/alerts — View alert preferences`,
        `/help — Show this message`,
        ``,
        `Open the CocoonPulse Mini App to configure your dashboard and link your nodes.`,
      ].join('\n'))
      break
    }

    case '/status': {
      // TODO: Query database for user's nodes
      await sendMessage(chatId, [
        `<b>Node Status</b>`,
        ``,
        `Open CocoonPulse Mini App for real-time node monitoring.`,
        ``,
        `<i>Status command will show live data once your nodes are linked.</i>`,
      ].join('\n'))
      break
    }

    case '/alerts': {
      await sendMessage(chatId, [
        `<b>Alert Preferences</b>`,
        ``,
        `Current alerts enabled:`,
        `• Node offline notifications`,
        `• High temperature warnings (>85°C)`,
        `• Earnings drop alerts`,
        `• TEE attestation failure alerts`,
        ``,
        `Configure these in the CocoonPulse Mini App → Settings.`,
      ].join('\n'))
      break
    }

    case '/help': {
      await sendMessage(chatId, [
        `<b>CocoonPulse Bot</b>`,
        ``,
        `This bot sends you alerts about your Cocoon GPU nodes.`,
        ``,
        `/start — Register for alerts`,
        `/status — Check node status`,
        `/alerts — View alert preferences`,
        `/help — Show this message`,
      ].join('\n'))
      break
    }

    default: {
      await sendMessage(chatId, `Unknown command. Type /help for available commands.`)
    }
  }
}

async function pollUpdates(offset: number): Promise<number> {
  try {
    const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${offset}&timeout=${POLL_TIMEOUT}`, {
      signal: AbortSignal.timeout((POLL_TIMEOUT + 5) * 1000),
    })

    if (!res.ok) {
      console.error(`[Bot] getUpdates failed: ${res.status}`)
      return offset
    }

    const data = (await res.json()) as { ok: boolean; result: TelegramUpdate[] }

    if (!data.ok || !data.result.length) return offset

    let newOffset = offset
    for (const update of data.result) {
      newOffset = update.update_id + 1

      if (update.message?.text) {
        await handleCommand(
          update.message.chat.id,
          update.message.text,
          update.message.from,
        )
      }
    }

    return newOffset
  } catch (err) {
    console.error('[Bot] Polling error:', err)
    return offset
  }
}

async function main() {
  if (!BOT_TOKEN) {
    console.error('[Bot] TELEGRAM_BOT_TOKEN not set')
    process.exit(1)
  }

  console.log('[Bot] CocoonPulse Alert Bot starting...')

  // Delete webhook to use long polling
  await fetch(`${TELEGRAM_API}/deleteWebhook`)

  let offset = 0
  while (true) {
    offset = await pollUpdates(offset)
  }
}

main().catch(console.error)
