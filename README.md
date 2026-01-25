# UNICC - Developer Productivity Dashboard

A modern, full-stack web application to track coding practice across multiple platforms (LeetCode, Codeforces, GeeksforGeeks, etc.) with beautiful data visualizations and analytics.

## ✨ Features

### Core Functionality
- 🔐 **Authentication** - Secure user authentication with Clerk
- ➕ **Session Management** - Add, edit, and delete coding practice sessions
- 📊 **Analytics Dashboard** - Real-time statistics and insights
- 🎯 **Progress Tracking** - Track problems solved by difficulty and platform

### Visualizations
- 📈 **Line Charts** - 30-day problem-solving trends
- 📊 **Bar Charts** - Weekly productivity insights
- 🔥 **Streak Calendar** - GitHub-style activity heatmap
- 🎨 **Difficulty Distribution** - Visual breakdown of problem difficulty
- 🏷️ **Topics Analysis** - Track most practiced topics

### UX Features
- 🌙 **Dark Theme** - Modern, eye-friendly dark interface
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Real-time Updates** - Instant feedback with toast notifications
- 🎭 **Loading States** - Smooth skeleton loaders
- ✨ **Smooth Animations** - Polished micro-interactions

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (Data visualization)
- React Hot Toast (Notifications)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

**Authentication:**
- Clerk

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Neon account (free tier works)
- A Clerk account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/unicc-dashboard.git
cd unicc-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="your_neon_database_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📸 Screenshots

[ screenshots of dashboard here soon]

## 🎯 Future Enhancements (v2.0)

- Platform API integrations (LeetCode, Codeforces auto-sync)
- AI-powered recommendations
- Advanced analytics and insights
- Export data to CSV/PDF
- Contest performance tracking

## 📝 License

MIT License

## 👤 Author

- GitHub: [Level-P1](https://github.com/Level-P1)
---
Explicitly a car(🐈) lover should give star to this project


Built with 🧠 using Next.js and TypeScript