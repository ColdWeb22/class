# Deploy to Render - Step by Step Guide

## What is Render?

Render is a modern cloud platform that makes deploying web applications easy. It offers:
- Free PostgreSQL database
- Automatic HTTPS
- Zero configuration deployment
- Auto-deploy on git push

## Prerequisites

- GitHub account
- Your project pushed to GitHub

## Deployment Steps

### 1. Prepare Your Repository

Make sure all changes are committed and pushed:

```bash
cd student-planner
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Sign Up for Render

1. Go to [https://render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account

### 3. Deploy Using Blueprint

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Click **"Connect account"** to connect your GitHub
3. Select your `student-planner` repository
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

Render will now:
- Create PostgreSQL database
- Deploy backend API service
- Deploy frontend static site
- Generate secure environment variables
- Provision HTTPS URLs

### 4. Wait for Deployment

- Backend: ~5-10 minutes (installing dependencies, building)
- Frontend: ~3-5 minutes (building React app)
- Database: ~2 minutes (provisioning)

You can watch live logs for each service.

### 5. Get Your URLs

Once deployed, you'll see URLs like:
- **Frontend:** `https://student-planner-client.onrender.com`
- **Backend:** `https://student-planner-api.onrender.com`

Share the **frontend URL** with anyone!

## Configuration Details

### What render.yaml Does

The `render.yaml` file tells Render how to deploy your app:

**Backend (Web Service):**
- Runs on Node.js
- Installs npm packages
- Connects to PostgreSQL database
- Auto-generates JWT secret

**Frontend (Static Site):**
- Builds React app with Vite
- Serves from `dist` folder
- Routes `/api/*` to backend service

**Database:**
- Free PostgreSQL instance
- 256MB storage
- Auto-backups
- Connection string auto-injected

### Environment Variables

Render automatically sets:
- `DATABASE_URL` - PostgreSQL connection (backend)
- `JWT_SECRET` - Securely generated (backend)
- `VITE_API_URL` - Backend URL (frontend)

You can add more in the Render dashboard:
1. Go to service → "Environment"
2. Add variables
3. Save changes (triggers re-deploy)

## Updating Your App

Every time you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Render automatically re-deploys! 🎉

## Important Notes

### Free Tier Limitations

- **Backend sleeps after 15 min inactivity**
  - First request takes ~30 seconds to wake
  - Subsequent requests are fast
  - Pay $7/mo for always-on
  
- **Database:** 256MB storage, 90 days retention
  - Enough for class projects
  - Upgrade available if needed

### Cold Start Fix

To keep your app alive, you can:
1. Use a free uptime monitor (UptimeRobot, Cron-job.org)
2. Ping your backend URL every 10 minutes
3. Or just accept the 30s wake-up time

### Custom Domains

Want your own domain?
1. Go to service → "Settings"
2. Click "Add Custom Domain"
3. Follow DNS setup instructions

## Troubleshooting

### Build Fails

**Check logs:**
1. Go to service in dashboard
2. Click "Logs" tab
3. Look for error messages

**Common issues:**
- Missing dependencies: Check `package.json`
- Build command wrong: Verify in `render.yaml`
- Node version: Add `"engines": {"node": "18.x"}` to `package.json`

### Database Connection Error

**Verify:**
1. Database is "Available" (not deploying)
2. Backend service has `DATABASE_URL` set
3. Check logs for Sequelize errors

**Fix:**
- Go to backend service → Environment
- Ensure `DATABASE_URL` is linked to database

### Frontend Shows API Errors

**Check:**
1. Backend service is running (green status)
2. `VITE_API_URL` points to correct backend URL
3. CORS settings in `server/src/server.js`

**Fix:**
- Update `VITE_API_URL` in frontend environment
- Rebuild frontend (push a commit)

### Slow First Load

This is normal! Free tier sleeps after inactivity.
- First load: ~30 seconds
- After wake: instant

## Alternative: Manual Setup

If you don't want to use `render.yaml`:

### Deploy Backend Manually

1. New → Web Service
2. Connect repo, root directory: `server`
3. Build: `npm install`
4. Start: `npm start`
5. Add environment variables manually

### Deploy Frontend Manually

1. New → Static Site
2. Connect repo, root directory: `client`
3. Build: `npm install && npm run build`
4. Publish: `dist`
5. Add `VITE_API_URL` pointing to backend

### Create Database Manually

1. New → PostgreSQL
2. Copy connection string
3. Add as `DATABASE_URL` to backend service

## Cost Summary

**Free Forever:**
- 1 PostgreSQL database (256MB)
- Multiple static sites
- 750 hours/month of web service runtime

**Perfect for:**
- Class projects
- Demos
- Personal portfolios
- Side projects

## Getting Help

- [Render Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)
- Check service logs for errors

## What's Next?

Once deployed:
1. Test all features
2. Share your URL with instructor/classmates
3. Monitor usage in Render dashboard
4. Add custom domain if desired

Your app is now live and accessible from anywhere! 🚀
