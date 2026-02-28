import { query } from '../client.js'

export interface AlertPreferences {
  node_offline: boolean
  temp_threshold: boolean
  temp_threshold_value: number
  earnings_drop: boolean
  tee_failure: boolean
}

/** Get alert preferences for a user (by wallet) */
export async function getAlertPreferences(walletAddress: string): Promise<AlertPreferences | null> {
  const result = await query<AlertPreferences>(
    `SELECT ap.node_offline, ap.temp_threshold, ap.temp_threshold_value,
            ap.earnings_drop, ap.tee_failure
     FROM alert_preferences ap
     JOIN users u ON u.id = ap.user_id
     WHERE u.wallet_address = $1`,
    [walletAddress],
  )
  return result.rows[0] ?? null
}

/** Upsert alert preferences */
export async function upsertAlertPreferences(
  walletAddress: string,
  prefs: Partial<AlertPreferences>,
): Promise<AlertPreferences> {
  const result = await query<AlertPreferences>(
    `INSERT INTO alert_preferences (user_id, node_offline, temp_threshold, temp_threshold_value, earnings_drop, tee_failure)
     SELECT u.id, $2, $3, $4, $5, $6
     FROM users u WHERE u.wallet_address = $1
     ON CONFLICT (user_id) DO UPDATE SET
       node_offline = COALESCE($2, alert_preferences.node_offline),
       temp_threshold = COALESCE($3, alert_preferences.temp_threshold),
       temp_threshold_value = COALESCE($4, alert_preferences.temp_threshold_value),
       earnings_drop = COALESCE($5, alert_preferences.earnings_drop),
       tee_failure = COALESCE($6, alert_preferences.tee_failure),
       updated_at = NOW()
     RETURNING *`,
    [
      walletAddress,
      prefs.node_offline ?? true,
      prefs.temp_threshold ?? true,
      prefs.temp_threshold_value ?? 85,
      prefs.earnings_drop ?? true,
      prefs.tee_failure ?? true,
    ],
  )
  return result.rows[0]
}
