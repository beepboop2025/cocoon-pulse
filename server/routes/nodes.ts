import { Router, type Request, type Response } from 'express'
import crypto from 'node:crypto'
import { getNodesByWallet, registerNode, deleteNode, updateNodeName } from '../db/queries/nodes.js'
import { findUserByWallet, ensureUser } from '../db/client.js'

export const nodesRouter = Router()

// GET /api/nodes?wallet=...
nodesRouter.get('/', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const rows = await getNodesByWallet(wallet)
    const nodes = rows.map((r) => ({
      nodeId: r.node_id,
      name: r.name,
      walletAddress: r.wallet_address,
      status: r.status,
      gpuUtilization: Number(r.gpu_utilization),
      vramUsed: Number(r.vram_used_mb),
      vramTotal: Number(r.vram_total_mb),
      temperature: Number(r.temperature),
      uptimeSeconds: Number(r.uptime_seconds),
      teeStatus: r.tee_status,
      lastHeartbeat: r.last_heartbeat,
      gpuModel: r.gpu_model,
    }))
    res.json({ nodes })
  } catch (err) {
    console.error('[nodes] GET / error:', err)
    res.status(500).json({ error: 'Failed to fetch nodes' })
  }
})

// POST /api/nodes/register
nodesRouter.post('/register', async (req: Request, res: Response) => {
  const { walletAddress, nodeId, name, gpuModel, vramTotalMb } = req.body as {
    walletAddress?: string
    nodeId?: string
    name?: string
    gpuModel?: string
    vramTotalMb?: number
  }

  if (!walletAddress || !nodeId) {
    res.status(400).json({ error: 'walletAddress and nodeId are required' })
    return
  }

  try {
    // Ensure user exists via Telegram auth data attached by middleware
    const telegramUser = (req as Record<string, unknown>).telegramUser as { id: number; username?: string; first_name?: string } | undefined
    const telegramId = telegramUser?.id ?? parseInt(crypto.createHash('sha256').update(walletAddress).digest('hex').slice(0, 12), 16)
    const user = await ensureUser(telegramId, walletAddress, telegramUser?.username, telegramUser?.first_name)

    const node = await registerNode(user.id, nodeId, walletAddress, name, gpuModel, vramTotalMb)
    res.json({
      success: true,
      node: {
        nodeId: node.node_id,
        walletAddress: node.wallet_address,
        name: node.name,
        registeredAt: node.created_at,
      },
    })
  } catch (err) {
    console.error('[nodes] POST /register error:', err)
    res.status(500).json({ error: 'Failed to register node' })
  }
})

// DELETE /api/nodes/:nodeId
nodesRouter.delete('/:nodeId', async (req: Request, res: Response) => {
  const { nodeId } = req.params
  const wallet = req.query.wallet as string
  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const deleted = await deleteNode(nodeId, wallet)
    if (!deleted) {
      res.status(404).json({ error: 'Node not found or not owned by this wallet' })
      return
    }
    res.json({ success: true, nodeId })
  } catch (err) {
    console.error('[nodes] DELETE error:', err)
    res.status(500).json({ error: 'Failed to delete node' })
  }
})

// PUT /api/nodes/:nodeId
nodesRouter.put('/:nodeId', async (req: Request, res: Response) => {
  const { nodeId } = req.params
  const { name, walletAddress } = req.body as { name?: string; walletAddress?: string }

  if (!name || !walletAddress) {
    res.status(400).json({ error: 'name and walletAddress are required' })
    return
  }

  try {
    const updated = await updateNodeName(nodeId, name, walletAddress)
    if (!updated) {
      res.status(404).json({ error: 'Node not found or not owned by this wallet' })
      return
    }
    res.json({ success: true, nodeId, name })
  } catch (err) {
    console.error('[nodes] PUT error:', err)
    res.status(500).json({ error: 'Failed to update node' })
  }
})
