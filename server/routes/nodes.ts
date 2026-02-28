import { Router, type Request, type Response } from 'express'

export const nodesRouter = Router()

// GET /api/nodes?wallet=...
nodesRouter.get('/', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Query database for nodes linked to this wallet
  // For now, return mock data
  res.json({
    nodes: [
      {
        nodeId: 'cocoon-node-001',
        name: 'GPU Node 1',
        walletAddress: wallet,
        status: 'online',
        gpuUtilization: 78,
        vramUsed: 62000,
        vramTotal: 81920,
        temperature: 72,
        uptimeSeconds: 2160000,
        teeStatus: 'verified',
        lastHeartbeat: new Date().toISOString(),
        gpuModel: 'NVIDIA A100 80GB',
      },
    ],
  })
})

// POST /api/nodes/register
nodesRouter.post('/register', (req: Request, res: Response) => {
  const { walletAddress, nodeId } = req.body as { walletAddress?: string; nodeId?: string }

  if (!walletAddress || !nodeId) {
    res.status(400).json({ error: 'walletAddress and nodeId are required' })
    return
  }

  // TODO: Insert into database, verify node exists on Cocoon network
  res.json({
    success: true,
    node: {
      nodeId,
      walletAddress,
      name: `Node ${nodeId.slice(-3)}`,
      registeredAt: new Date().toISOString(),
    },
  })
})

// DELETE /api/nodes/:nodeId
nodesRouter.delete('/:nodeId', (req: Request, res: Response) => {
  const { nodeId } = req.params

  // TODO: Remove from database
  res.json({ success: true, nodeId })
})

// PUT /api/nodes/:nodeId
nodesRouter.put('/:nodeId', (req: Request, res: Response) => {
  const { nodeId } = req.params
  const { name } = req.body as { name?: string }

  // TODO: Update in database
  res.json({ success: true, nodeId, name })
})
