# 🚀 Student Planner - Setup & Configuration Guide

## Overview

This guide walks you through setting up authentication for the Student Planner app with:
- ✅ Email/Password registration and login
- ✅ Google OAuth authentication
- ✅ Session management
- ✅ JWT tokens

---

## 📋 Quick Start Checklist

- [ ] Step 1: Get Google OAuth Credentials
- [ ] Step 2: Configure Environment Variables
- [ ] Step 3: Install Dependencies
- [ ] Step 4: Start the Application
- [ ] Step 5: Test the Authentication

---

## Step 1: Get Google OAuth Credentials

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select **"NEW PROJECT"**
3. Enter a project name (e.g., "Student Planner") and click **CREATE**
4. Wait for the project to be created, then select it

### Enable Google+ API

1. Go to **APIs & Services** > **Library** (in the left sidebar)
2. Search for **"Google+ API"**
3. Click on it and select **ENABLE**

### Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials** (in the left sidebar)
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Choose **External** as the user type
   - Fill in the app name: "Student Planner"
   - Add your email as a test user
   - Add these scopes:
     - `userinfo.email`
     - `userinfo.profile`
   - Complete and save the consent screen

4. Back to creating credentials, select **Web application**
5. Add **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Click **CREATE**
7. **Copy your credentials** - you'll need these in the next step:
   - Client ID
   - Client Secret

---

## Step 2: Configure Environment Variables

### Update Server Environment Variables

1. Open `/server/.env` in your editor
2. Find these lines and replace with your Google credentials:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

3. Also update the session secret for security:
   ```env
   SESSION_SECRET=your-random-secret-key-here
   ```

   *Tip: Generate a random key with:*
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Example .env file

Your `/server/.env` should look like:
```env
PORT=5000
NODE_ENV=development
DB_DIALECT=sqlite
JWT_SECRET=super-secret-jwt-key-for-development-only
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your-session-secret-key-change-this
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## Step 3: Install Dependencies

### Install Server Dependencies

```bash
cd server
npm install
```

### Install Client Dependencies

```bash
cd ../client
npm install
```

---

## Step 4: Start the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Google OAuth strategy configured
Server running on port 5000
Environment: development
```

### Start the Frontend Client (in a new terminal)

```bash
cd client
npm run dev
```

The app will open at `http://localhost:5173`

---

## Step 5: Test the Authentication

### Test Registration with Google

1. Navigate to `http://localhost:5173/register`
2. Click **"Continue with Google"**
3. Sign in with your Google account (must be added as test user)
4. You should be redirected to the dashboard
5. Check browser console for any errors

### Test Login with Google

1. Navigate to `http://localhost:5173/login`
2. Click **"Continue with Google"**
3. Select the same Google account
4. You should be logged in

### Test Email/Password Registration

1. Navigate to `http://localhost:5173/register`
2. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
3. Click **Sign Up**
4. You should be redirected to the dashboard

### Test Email/Password Login

1. Navigate to `http://localhost:5173/login`
2. Enter the email and password from above
3. Click **Sign In**
4. You should be logged in

---

## 🔐 Authentication Flow

### Google OAuth Flow

```
User clicks "Continue with Google"
        ↓
Redirects to: /api/auth/google
        ↓
Google login screen
        ↓
User approves permissions
        ↓
Google redirects to: /api/auth/google/callback
        ↓
Server verifies token & finds/creates user
        ↓
Server redirects to: /auth/google/callback?token=JWT_TOKEN
        ↓
Frontend receives token and stores it
        ↓
User logged in! ✅
```

### Email/Password Flow

```
User fills form & clicks "Sign Up"
        ↓
POST /api/auth/register
        ↓
Server validates & creates user
        ↓
Server returns JWT token
        ↓
Frontend stores token
        ↓
User logged in! ✅
```

---

## 📁 Key Files

- **Backend Auth Config**: `/server/src/config/passport.js` - Google OAuth strategy
- **Backend Auth Routes**: `/server/src/routes/authRoutes.js` - Auth endpoints
- **Backend Auth Controller**: `/server/src/controllers/authController.js` - Login/Register logic
- **Frontend Login**: `/client/src/pages/Login.jsx` - Login form
- **Frontend Register**: `/client/src/pages/Register.jsx` - Registration form
- **Frontend Auth Context**: `/client/src/context/AuthContext.jsx` - State management
- **Google Callback**: `/client/src/pages/GoogleCallback.jsx` - OAuth callback handler

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URL doesn't match Google Cloud Console settings
**Solution**: Ensure `GOOGLE_CALLBACK_URL` in `.env` matches exactly what's in Google Cloud Console

### Error: "Access blocked: Authorization Error"

**Cause**: Your email isn't added as a test user
**Solution**: 
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** > **OAuth consent screen**
3. Add your email under "Test users"

### Error: "Google authentication is not configured"

**Cause**: `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is missing
**Solution**: Check that both are set in `/server/.env`

### Google sign-in button doesn't work

**Cause**: Frontend can't reach the backend
**Solution**: 
1. Ensure backend is running on port 5000
2. Check that `VITE_API_URL` in `/client/.env` is `http://localhost:5000`

### User data not saving after Google login

**Cause**: Database connection issue
**Solution**: Check `/server/src/config/database.js` configuration

---

## 🚀 Next Steps

### For Production Deployment

When deploying to production:

1. **Get a valid domain** (e.g., from Render, Netlify, etc.)

2. **Update Google Console**:
   ```
   Authorized redirect URIs:
   https://your-api-domain.com/api/auth/google/callback
   ```

3. **Set environment variables** on your hosting platform:
   ```
   GOOGLE_CLIENT_ID=xxxxx
   GOOGLE_CLIENT_SECRET=xxxxx
   GOOGLE_CALLBACK_URL=https://your-api-domain.com/api/auth/google/callback
   FRONTEND_URL=https://your-frontend-domain.com
   SESSION_SECRET=random-secret-key
   ```

4. **Update CORS** in backend for production domain

---

## ✅ Verification Checklist

- [ ] `.env` file has Google Client ID and Secret
- [ ] `.env` file has SESSION_SECRET set
- [ ] `npm install` completed for both server and client
- [ ] Backend runs without errors: `npm run dev` in `/server`
- [ ] Frontend runs without errors: `npm run dev` in `/client`
- [ ] Can see "Google OAuth strategy configured" in backend logs
- [ ] Google sign-in button appears on register page
- [ ] Google sign-in button appears on login page
- [ ] Can click Google button without errors
- [ ] Can successfully register with Google
- [ ] Can successfully login with Google
- [ ] User data persists after refresh

---

## 📞 Still Having Issues?

1. Check the **Browser Console** for client-side errors (F12)
2. Check the **Terminal** where you ran `npm run dev` for server errors
3. Review [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for more details
4. Verify all environment variables are correctly set

---

**Happy coding! 🎉**
