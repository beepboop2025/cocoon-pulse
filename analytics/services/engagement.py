"""Engagement analytics service — computes DAU/MAU, retention cohorts, and completion rates."""

import psycopg2
import psycopg2.extras
import os
from datetime import date, datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cocoon:cocoon@localhost:5432/cocoon_pulse")


def _get_conn():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)


def compute_dau_mau() -> dict:
    """Compute Daily/Weekly/Monthly Active Users based on earnings activity."""
    with _get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            WITH active_nodes AS (
                SELECT DISTINCT n.user_id, e.completed_at::date AS activity_date
                FROM earnings e
                JOIN nodes n ON n.node_id = e.node_id
            )
            SELECT
                COUNT(DISTINCT CASE WHEN activity_date = CURRENT_DATE THEN user_id END) AS dau,
                COUNT(DISTINCT CASE WHEN activity_date >= CURRENT_DATE - 7 THEN user_id END) AS wau,
                COUNT(DISTINCT CASE WHEN activity_date >= CURRENT_DATE - 30 THEN user_id END) AS mau
            FROM active_nodes
        """)
        row = cur.fetchone()
        dau = row["dau"]
        mau = row["mau"] or 1
        return {
            "dau": dau,
            "wau": row["wau"],
            "mau": row["mau"],
            "dau_mau_ratio": round(dau / mau, 3),
            "date": str(date.today()),
        }


def compute_retention_cohorts(weeks: int = 4) -> list[dict]:
    """Compute weekly retention cohorts based on user signup date vs. continued activity."""
    with _get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            WITH cohorts AS (
                SELECT
                    u.id AS user_id,
                    date_trunc('week', u.created_at)::date AS cohort_week
                FROM users u
                WHERE u.created_at >= CURRENT_DATE - interval '%s weeks'
            ),
            activity AS (
                SELECT DISTINCT n.user_id, date_trunc('week', e.completed_at)::date AS activity_week
                FROM earnings e
                JOIN nodes n ON n.node_id = e.node_id
            )
            SELECT
                c.cohort_week,
                COUNT(DISTINCT c.user_id) AS users_joined,
                COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + interval '1 week' THEN c.user_id END)::float
                    / GREATEST(COUNT(DISTINCT c.user_id), 1) AS week_1,
                COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + interval '2 weeks' THEN c.user_id END)::float
                    / GREATEST(COUNT(DISTINCT c.user_id), 1) AS week_2,
                COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + interval '3 weeks' THEN c.user_id END)::float
                    / GREATEST(COUNT(DISTINCT c.user_id), 1) AS week_3,
                COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + interval '4 weeks' THEN c.user_id END)::float
                    / GREATEST(COUNT(DISTINCT c.user_id), 1) AS week_4
            FROM cohorts c
            LEFT JOIN activity a ON a.user_id = c.user_id
            GROUP BY c.cohort_week
            ORDER BY c.cohort_week
        """ % weeks)
        return [dict(row) for row in cur.fetchall()]


def compute_challenge_completion_rates() -> list[dict]:
    """Compute task completion rates grouped by task type."""
    with _get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT
                task_type AS period,
                COUNT(*) AS total_tasks,
                COUNT(CASE WHEN ton_reward > 0 THEN 1 END) AS completed_tasks,
                ROUND(COUNT(CASE WHEN ton_reward > 0 THEN 1 END)::numeric / GREATEST(COUNT(*), 1) * 100, 1) AS completion_rate,
                ROUND(AVG(compute_time_ms)::numeric, 0) AS avg_compute_time_ms
            FROM earnings
            WHERE completed_at >= CURRENT_DATE - 30
            GROUP BY task_type
            ORDER BY total_tasks DESC
        """)
        return [dict(row) for row in cur.fetchall()]


def get_top_earners(limit: int = 10) -> list[dict]:
    """Get top earning operators by total TON rewards."""
    with _get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT
                u.username,
                u.wallet_address,
                SUM(e.ton_reward) AS total_earnings,
                COUNT(e.id) AS total_tasks,
                COUNT(DISTINCT n.node_id) AS node_count
            FROM earnings e
            JOIN nodes n ON n.node_id = e.node_id
            JOIN users u ON u.id = n.user_id
            GROUP BY u.id, u.username, u.wallet_address
            ORDER BY total_earnings DESC
            LIMIT %s
        """, (limit,))
        return [dict(row) for row in cur.fetchall()]


def get_full_engagement_summary() -> dict:
    """Compute all engagement metrics and return a summary."""
    return {
        "dau_mau": compute_dau_mau(),
        "retention": compute_retention_cohorts(),
        "challenge_rates": compute_challenge_completion_rates(),
        "top_earners": get_top_earners(),
        "generated_at": datetime.utcnow().isoformat(),
    }
