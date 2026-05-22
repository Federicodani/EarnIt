# Earnova Station — Full Stack MERN App

A complete clone of [earnovastation.co.ke](https://earnovastation.co.ke) built with the **MERN stack** (MongoDB, Express, React, Node.js). Features a captivating dark teal design system with all original features replicated and expanded.

---

## 🌟 Features Implemented

### Public Pages
- **Landing Page** — Hero, animated stat counters, How It Works (4-step), Testimonials, FAQ accordion, Telegram CTA, newsletter signup, final CTA
- **How It Works Page** — Detailed 5-step process, Membership Tier breakdown, Success Tips grid
- **Login Page** — Split-panel layout, email/password login, "Remember me", show/hide password, Forgot Password link, Telegram CTA, Login/Register tab switcher
- **Register Page** — 2-step form wizard (Personal Info → Account Setup), country selector, password confirmation, terms agreement
- **Forgot Password Page** — Dual-field identity verification (email + phone), new password step, success confirmation screen

### Authenticated Pages
- **Dashboard** — Welcome banner with balance, 4-stat grid (earned/tasks/balance/active), task list, quick actions, Telegram card, Membership progress bar
- **Tasks Page** — Task cards with category filter, difficulty badge, country + time metadata, Start/Submit flow, submission modal with verification code + notes
- **Withdraw Page** — Method selector (M-Pesa, PayPal, Stripe, Bank Transfer), quick-amount buttons, withdrawal history with status badges
- **Profile Page** — Avatar with tier badge, tabbed UI (Profile / Stats / Security), editable form, account stats panel

### Backend API
- `POST /api/auth/register` — Create account with validation
- `POST /api/auth/login` — JWT authentication
- `GET  /api/auth/me` — Fetch current user
- `PUT  /api/auth/update-profile` — Update user details
- `POST /api/auth/forgot-password` — Verify identity (email + phone)
- `PUT  /api/auth/reset-password/:token` — Reset with token
- `GET  /api/tasks/available` — Browse available tasks
- `POST /api/tasks/:id/start` — Claim a task
- `PUT  /api/tasks/:id/submit` — Submit task with data
- `GET  /api/tasks/my-tasks` — User's task history
- `POST /api/tasks/` *(admin)* — Create a new task
- `PUT  /api/tasks/review/:id` *(admin)* — Approve/reject submission
- `POST /api/withdrawals` — Request withdrawal
- `GET  /api/withdrawals/my` — User's withdrawal history
- `GET  /api/withdrawals/` *(admin)* — All withdrawals
- `PUT  /api/withdrawals/:id` *(admin)* — Update withdrawal status

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm

### 1. Clone / Extract the project
```bash
cd earnova-station
```

### 2. Install all dependencies
```bash
npm run install:all
```
This installs root, server, and client dependencies in one command.

### 3. Configure environment
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/earnova
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 4. Run in development mode
```bash
npm run dev
```
- **API**: http://localhost:5000
- **React App**: http://localhost:3000

### 5. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
earnova-station/
├── package.json              # Root scripts (run both together)
├── README.md
│
├── server/                   # Express + MongoDB API
│   ├── index.js              # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── UserTask.js
│   │   └── Withdrawal.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── withdrawals.js
│   └── middleware/
│       └── auth.js
│
└── client/                   # React frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css            # Global design system
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   └── Footer.js
        └── pages/
            ├── LandingPage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── ForgotPasswordPage.js
            ├── Dashboard.js
            ├── TasksPage.js
            ├── WithdrawPage.js
            ├── ProfilePage.js
            └── HowItWorksPage.js
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Navy | `#0a0f1e` |
| Card Navy | `#141d2e` |
| Teal Accent | `#00e5c3` |
| Gold | `#f5c518` |
| Violet | `#7c5cfc` |
| Coral | `#ff6b6b` |
| Fonts | Syne (headings) + DM Sans (body) |

---

## 🔐 Security Notes

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Authentication via signed **JWT tokens**
- Password reset uses **crypto.randomBytes** token hashed with SHA-256
- All protected routes validated via `protect` middleware
- Admin routes additionally gated with `adminOnly` middleware

---

## 📞 Support & Community

Join the Telegram community: [t.me/+3E7iJLy_94MyMzg0](https://t.me/+3E7iJLy_94MyMzg0)
