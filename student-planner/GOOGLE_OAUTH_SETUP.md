# Google OAuth Setup Guide

## Setting up Google OAuth for Student Planner

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** for your project

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Configure the OAuth consent screen if prompted:
   - Choose **External** for user type
   - Fill in the required app information
   - Add your email as a test user during development
4. Select **Web application** as the application type
5. Add the following **Authorized redirect URIs**:
   - For local development: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://student-planner-api.onrender.com/api/auth/google/callback`
6. Click **Create**
7. Copy your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

#### Local Development (.env file in server folder)

Create a `.env` file in the `server` directory:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_random_secret_key_here
```

#### Production (Render Dashboard)

1. Go to your Render dashboard
2. Select your **student-planner-api** service
3. Go to **Environment** tab
4. Add the following environment variables:
   - `GOOGLE_CLIENT_ID`: Your Google Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google Client Secret
   - `GOOGLE_CALLBACK_URL`: `https://student-planner-api.onrender.com/api/auth/google/callback`
   - `FRONTEND_URL`: `https://student-planner-client.onrender.com`
   - `SESSION_SECRET`: A random secret key (or let Render generate it)

### 4. Update OAuth Consent Screen

1. Go back to **APIs & Services** > **OAuth consent screen**
2. Add authorized domains:
   - `onrender.com`
3. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`

### 5. Test the Integration

1. Deploy your changes to Render
2. Visit your app's register/login page
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected back to the dashboard

## Rate Limiting

The following rate limits have been implemented:

- **Registration**: 5 attempts per 15 minutes per IP
- **Login**: 10 attempts per hour per IP
- **General API**: 100 requests per 15 minutes per IP

## Security Features

✅ CORS properly configured for production  
✅ Google OAuth 2.0 authentication  
✅ Rate limiting on auth endpoints  
✅ Session management with secure cookies  
✅ JWT tokens for API authentication  
✅ Helmet for security headers  

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure the callback URL in Google Cloud Console exactly matches your environment variable
- Check that you've added both development and production URLs

### "Access blocked: Authorization Error"
- Add your email as a test user in the OAuth consent screen
- If publishing the app, complete the OAuth verification process

### Authentication fails silently
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure CORS is properly configured
