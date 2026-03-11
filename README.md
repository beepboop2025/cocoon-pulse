# Cocoon Pulse

**A Telegram Mini App for real-time GPU node monitoring and management on the Cocoon network.**

---

## Features

- **Real-Time Node Monitoring** -- Track GPU utilization, VRAM usage, temperature, uptime, and TEE status across all your nodes with live-updating metrics.
- **Earnings Dashboard** -- View daily, weekly, monthly, and all-time earnings with trend sparklines and animated counters.
- **Engagement Analytics** -- A dedicated Python analytics service computes DAU/MAU ratios, retention cohorts, and task completion rates.
- **Node Management** -- Start, stop, and restart GPU nodes directly from the Mini App interface.
- **Alert System** -- Receive Telegram notifications when a node goes offline, temperature thresholds are exceeded, or earnings drop unexpectedly.
- **Glassmorphism UI** -- A polished interface with frosted-glass panels, animated number transitions, and inline sparkline charts.
- **Telegram WebApp SDK Integration** -- Built as a native Telegram Mini App using the official SDK, with TON Connect wallet linking.

---

## Tech Stack

### Frontend

- React 19 with TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand for state management
- Recharts and sparklines for data visualization
- Framer Motion for animations
- Telegram Apps SDK (`@telegram-apps/sdk-react`)
- TON Connect (`@tonconnect/ui-react`)

### Backend

- Express 5 (TypeScript, via `tsx`)
- PostgreSQL 17 (`pg`)
- Redis 7 (`ioredis`) for metric caching
- Telegram bot for alerts (`alertBot.ts`)

### Analytics

- Python 3.12 with FastAPI
- Pandas and NumPy for engagement metric computation
- Runs as an independent service on port 8080

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+ (for the analytics service)
- PostgreSQL 17 and Redis 7 (or use Docker Compose)

### Installation

```bash
git clone https://github.com/beepboop2025/cocoon-pulse.git
cd cocoon-pulse
npm install
```

### Running the Dev Server

Start the frontend, backend, and bot in separate terminals:

```bash
# Frontend (http://localhost:5173)
npm run dev

# Backend API (http://localhost:3001)
npm run server

# Telegram alert bot
npm run bot
```

To run the analytics service:

```bash
cd analytics
pip install -r requirements.txt
python main.py
```

### Docker Compose

To run all services together:

```bash
cp .env.example .env
# Edit .env with your Telegram bot token and Cocoon API key

docker compose up --build
```

---

## License

This project is licensed under the [MIT License](LICENSE).
