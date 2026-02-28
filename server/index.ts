import express from 'express'
import cors from 'cors'
import { nodesRouter } from './routes/nodes.js'
import { earningsRouter } from './routes/earnings.js'
import { networkRouter } from './routes/network.js'
import { settingsRouter } from './routes/settings.js'
import { validateTelegramAuth } from './middleware/auth.js'
import { CocoonPoller } from './services/cocoonPoller.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://t.me',
  credentials: true,
}))
app.use(express.json({ limit: '10kb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth middleware — validates Telegram initData
app.use('/api', validateTelegramAuth)

// Routes
app.use('/api/nodes', nodesRouter)
app.use('/api/earnings', earningsRouter)
app.use('/api/network', networkRouter)
app.use('/api/settings', settingsRouter)

// Start server
app.listen(PORT, () => {
  console.log(`CocoonPulse API running on port ${PORT}`)
})

// Start polling Cocoon network for node metrics
const poller = new CocoonPoller()
poller.start()

// Graceful shutdown
function shutdown() {
  console.log('Shutting down...')
  poller.stop()
  process.exit(0)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
