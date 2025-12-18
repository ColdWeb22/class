# 🎯 Quick Reference - Getting Started

## 1️⃣ Get Google OAuth Credentials (5 minutes)

```
1. Go to https://console.cloud.google.com/
2. Create New Project → "Student Planner"
3. APIs & Services > Library → Enable "Google+ API"
4. APIs & Services > Credentials → Create OAuth 2.0 Client ID
5. Web Application → Add redirect URI:
   http://localhost:5000/api/auth/google/callback
6. Copy Client ID and Client Secret
```

## 2️⃣ Add Credentials to `.env` (2 minutes)

**File: `/server/.env`**

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-random-secret-key
```

## 3️⃣ Install & Run (3 minutes)

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend (wait for backend to start first)
cd client
npm install
npm run dev
```

## 4️⃣ Test It!

- Go to: http://localhost:5173/register
- Click: "Continue with Google"
- Done! ✅

---

## 📍 Important Files

| File | Purpose |
|------|---------|
| `/server/.env` | Backend configuration (put Google credentials here) |
| `/client/.env` | Frontend configuration |
| `/server/src/config/passport.js` | Google OAuth strategy setup |
| `/server/src/routes/authRoutes.js` | Auth API endpoints |
| `/client/src/pages/Login.jsx` | Login page with Google button |
| `/client/src/pages/Register.jsx` | Registration page with Google button |

---

## 🔐 How It Works

**Google OAuth:**
1. User clicks "Continue with Google" button
2. Redirected to Google login
3. Google approves, redirects back to your app
4. Backend creates/finds user in database
5. Frontend stores JWT token in localStorage
6. User is logged in! ✅

**Email/Password:**
1. User fills form (name, email, password)
2. Form submitted to `/api/auth/register`
3. Backend validates and creates user
4. JWT token returned to frontend
5. User is logged in! ✅

---

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "redirect_uri_mismatch" | Check `.env` GOOGLE_CALLBACK_URL matches Google Console |
| "Authorization Error" | Add your email as test user in Google OAuth consent screen |
| "Not configured" error | Ensure both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are in `.env` |
| Can't click Google button | Check backend is running on port 5000 |
| Login works but user data missing | Check database is connected |

---

## 🚀 Next: Production Setup

When ready to deploy, update:
1. Google Console redirect URIs → your production API URL
2. `.env` on hosting platform with real credentials
3. `FRONTEND_URL` → your production frontend domain
4. `CORS_ORIGIN` → your production domain

---

**See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.**
