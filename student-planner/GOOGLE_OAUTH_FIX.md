# Google OAuth Callback 500 Error - Fix Documentation

## Issues Identified & Fixed

### 1. **Incorrect Redirect URL** ✅ FIXED
**Problem**: The callback handler was redirecting to the home page (`/?googleToken=...`) instead of the GoogleCallback component.

**Fix Applied**: Updated [authController.js](server/src/controllers/authController.js) to redirect to `/auth/google/callback?googleToken=...`

```javascript
// Before (WRONG):
res.redirect(`${frontendURL}/?googleToken=${token}`);

// After (CORRECT):
const callbackURL = `${frontendURL}/auth/google/callback?googleToken=${token}`;
res.redirect(callbackURL);
```

### 2. **Missing Error Validation** ✅ FIXED
**Problem**: The callback didn't validate if `req.user` existed, which could cause 500 errors if Passport authentication failed.

**Fix Applied**: Added validation to check `req.user` before creating the token:

```javascript
if (!req.user) {
  console.error('❌ Google Callback: No user found in request');
  return res.redirect(`${frontendURL}/login?error=authentication_failed`);
}
```

### 3. **Improved Error Logging** ✅ FIXED
**Problem**: Errors weren't being logged, making debugging difficult.

**Fix Applied**: Enhanced logging in both `authController.js` and `passport.js` with detailed error messages and stack traces.

### 4. **Session Cookie Configuration** ✅ FIXED
**Problem**: Session cookies weren't configured properly for cross-domain OAuth redirects.

**Fix Applied**: Updated [server.js](server/src/server.js) to use proper cookie settings:

```javascript
cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'Lax', // Allow cross-site cookies for OAuth redirect
  maxAge: 24 * 60 * 60 * 1000
}
```

## Required Environment Variables on Render

For Google OAuth to work on production, you **MUST** set these environment variables in your Render dashboard:

### Backend Service (.env or Render Dashboard Settings)

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# This is critical! Must match your frontend URL exactly
GOOGLE_CALLBACK_URL=https://student-planner-api.onrender.com/api/auth/google/callback

# Also ensure these are set
FRONTEND_URL=https://student-planner-client.onrender.com
JWT_SECRET=your-secure-jwt-secret-key
SESSION_SECRET=your-secure-session-secret-key
NODE_ENV=production
DATABASE_URL=your-database-url
```

## Required Configuration in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to OAuth 2.0 credentials
4. Edit your OAuth 2.0 Client ID (or create one if it doesn't exist)
5. Add these **Authorized Redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (for local development)
   - `https://student-planner-api.onrender.com/api/auth/google/callback` (for production)

6. Add these **Authorized JavaScript Origins**:
   - `http://localhost:5000` (development)
   - `http://localhost:5173` (dev frontend)
   - `https://student-planner-api.onrender.com` (production)
   - `https://student-planner-client.onrender.com` (production)

## OAuth Flow Diagram

```
1. User clicks "Sign in with Google" on Login page
   ↓
2. Browser redirects to: GET /api/auth/google
   ↓
3. Server redirects to Google OAuth consent screen with scope: profile, email
   ↓
4. User grants permission
   ↓
5. Google redirects to: GET /api/auth/google/callback?code=...&state=...
   ↓
6. Server exchanges code for access token with Google
   ↓
7. Server looks up/creates user in database based on email
   ↓
8. Passport serializes user into session
   ↓
9. Server generates JWT token for frontend
   ↓
10. Server redirects to: 
    ${FRONTEND_URL}/auth/google/callback?googleToken=${token}
    ↓
11. Frontend GoogleCallback component:
    - Extracts token from URL
    - Stores token in localStorage
    - Fetches user profile
    - Updates Auth context
    - Redirects to /dashboard
```

## Testing Checklist

- [ ] Verify `FRONTEND_URL` is set in Render backend service environment variables
- [ ] Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Render
- [ ] Verify callback URL is registered in Google Cloud Console
- [ ] Test OAuth flow in development: Click "Sign in with Google", check if redirected to GoogleCallback component
- [ ] Check browser console for errors (should be empty)
- [ ] Check Render backend logs for:
  - `🔵 OAuth Strategy Configured` (at startup)
  - `✅ Google OAuth strategy configured` (at startup)
  - `🔹 Google Callback received` (when user authenticates)
  - `✅ Google Callback: User authenticated` (successful flow)
- [ ] Verify user is created/updated in database
- [ ] Verify JWT token is generated and returned
- [ ] Verify frontend receives token and displays dashboard

## Common Causes of 500 Error

1. **`FRONTEND_URL` not set** → Redirect URL is malformed
2. **Google credentials not configured** → Passport can't authenticate
3. **Callback URL mismatch** → Google won't redirect to our endpoint
4. **Database connection issue** → Can't create/find user
5. **Session secret not set** → Session middleware fails

## Files Modified

- ✅ [server/src/controllers/authController.js](server/src/controllers/authController.js) - Fixed redirect URL and added validation
- ✅ [server/src/server.js](server/src/server.js) - Improved session cookie configuration
- ✅ [server/src/config/passport.js](server/src/config/passport.js) - Enhanced error logging

## If Issues Persist

1. Check Render backend logs for detailed error messages
2. Ensure all environment variables are set correctly
3. Verify Google Cloud Console configuration matches exactly
4. Test with a fresh incognito window (clears cookies)
5. Check that user database table has `googleId` column
