import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://cocoon:cocoon@localhost:5432/cocoon_pulse',
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err)
})

/** Run a parameterized query against the pool */
export async function query<T extends pg.QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  const start = Date.now()
  const result = await pool.query<T>(text, params)
  const duration = Date.now() - start
  if (duration > 500) {
    console.warn(`[DB] Slow query (${duration}ms): ${text.slice(0, 80)}`)
  }
  return result
}

/** Get a client from the pool for transactions */
export async function getClient() {
  return pool.connect()
}

/** Ensure user exists (upsert by telegram_id), return user row */
export async function ensureUser(telegramId: number, wallet?: string, username?: string, firstName?: string) {
  const result = await query(
    `INSERT INTO users (telegram_id, wallet_address, username, first_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (telegram_id) DO UPDATE SET
       wallet_address = COALESCE($2, users.wallet_address),
       username = COALESCE($3, users.username),
       first_name = COALESCE($4, users.first_name),
       updated_at = NOW()
     RETURNING *`,
    [telegramId, wallet, username, firstName],
  )
  return result.rows[0]
}

/** Find user by wallet address */
export async function findUserByWallet(walletAddress: string) {
  const result = await query('SELECT * FROM users WHERE wallet_address = $1', [walletAddress])
  return result.rows[0] ?? null
}

/** Graceful shutdown */
export async function closePool() {
  await pool.end()
}

export default pool
