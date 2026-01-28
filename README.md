# UNICC – Developer Productivity Dashboard

A full-stack dashboard to track coding practice sessions and visualize productivity across platforms like LeetCode and Codeforces.

## ✨ What it does
- User authentication (Clerk)
- Log coding practice sessions
- Visual analytics (charts, streaks, trends)
- Responsive dark-themed dashboard

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Recharts  
- **Backend:** Next.js API Routes, Prisma, PostgreSQL (Neon)  
- **Auth:** Clerk

## 📸 Screenshots

### Dashboard Overview
![Dashboard](./screenshots/dashboard.gif)

### Session Management
![Sessions](./screenshots/sessions.png)

## 🚀 Local Setup
```bash
git clone https://github.com/Level-P1/unicc-dashboard.git
cd unicc-dashboard
npm install

## Environment setup
- Set up environment variables: Create a .env file in the root directory:

DATABASE_URL="your_neon_database_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

## Set up the database:

npx prisma db push
npx prisma generate

Built with 🧠 using Next.js and TypeScript by P1