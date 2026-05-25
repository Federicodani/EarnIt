# Earnova Station — MERN Stack App

Full-stack earn-by-verifying platform with package subscriptions paid via M-Pesa.

---

## 🚀 Deploy in 10 Minutes

### Step 1 — Deploy Backend to Render

1. Push the `server/` folder (or the whole repo) to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, set **Root Directory** to `server`
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add these **Environment Variables**:

| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | Your Vercel URL (add after step 2) |
| `PORT` | `10000` |

6. Deploy — copy the URL (e.g. `https://earnova-api.onrender.com`)

---

### Step 2 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import your repo
2. Set **Root Directory** to `client`
3. Vercel auto-detects Vite. Framework preset: **Vite**
4. Add **Environment Variable**:

| Key | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL (e.g. `https://earnova-api.onrender.com`) |

5. Deploy ✅

6. Go back to Render → update `CLIENT_URL` env var with your Vercel URL

---

## 💻 Run Locally

```bash
# 1. Install all deps
npm run install:all

# 2. Configure server
cp server/.env.example server/.env
# Edit MONGO_URI and JWT_SECRET

# 3. Configure client (optional for local — proxy handles it)
# No .env needed locally; Vite proxies /api → localhost:5000

# 4. Start everything
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 📁 Project Structure

```
earnova-station/
├── render.yaml               # Render deploy config
├── package.json              # Root: run both together
│
├── server/                   # Node/Express API (deploy to Render)
│   ├── index.js
│   ├── .env.example
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── UserTask.js
│   │   ├── Withdrawal.js
│   │   └── PackagePurchase.js
│   └── routes/
│       ├── auth.js
│       ├── tasks.js
│       ├── withdrawals.js
│       └── packages.js
│
└── client/                   # React + Vite (deploy to Vercel)
    ├── index.html            # Vite entry
    ├── vite.config.js
    ├── vercel.json           # SPA routing fix
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.js
        ├── index.css
        ├── context/AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   └── Footer.js
        └── pages/
            ├── LandingPage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── ForgotPasswordPage.js
            ├── Dashboard.js
            ├── PackagesPage.js   ← NEW
            ├── TasksPage.js
            ├── WithdrawPage.js
            ├── ProfilePage.js
            └── HowItWorksPage.js
```

---

## 📦 Package System

| Package | Price | Tasks/Day |
|---|---|---|
| 🚀 Starter | KSh 500 | 15/day |
| ⭐ Standard | KSh 1,000 | 25/day |
| 💎 Premium | KSh 1,500 | 40/day |

**M-Pesa Till Number: `5377179`**

Flow: User selects plan → sends M-Pesa to till → submits transaction code → admin approves → package activates.

---

## 🔐 Tech Stack

- **Frontend:** React 18 + Vite 5 + React Router 6
- **Backend:** Express 4 + MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Payments:** M-Pesa manual verification
