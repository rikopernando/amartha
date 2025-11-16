# Deployment Guide

This guide will help you deploy the Employee Registration Wizard to Vercel or Netlify.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel or Netlify account (free tier works)

## Option 1: Deploy to Vercel

### Method A: Using Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: `amartha-employee-wizard` (or your choice)
   - Directory: `./` (press Enter)
   - Override settings? **N**

5. Deploy to production:
```bash
vercel --prod
```

### Method B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click **"Add New Project"**

3. Import your Git repository

4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Click **"Deploy"**

6. Wait for deployment to complete (usually 1-2 minutes)

7. Your app will be available at: `https://your-project-name.vercel.app`

### Vercel Environment Variables

No environment variables are needed for the basic deployment since we use localhost APIs in development.

For production, you would need to:
1. Deploy mock APIs separately (e.g., to Railway, Render, or Heroku)
2. Add environment variables:
   - `VITE_API_BASIC_INFO_URL`: URL for basicInfo API
   - `VITE_API_DETAILS_URL`: URL for details API

## Option 2: Deploy to Netlify

### Method A: Using Netlify CLI

1. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
```

4. Follow the prompts:
   - Create & configure a new site
   - Team: Select your team
   - Site name: `amartha-employee-wizard` (or leave blank for random)
   - Build command: `npm run build`
   - Directory to deploy: `dist`

5. Deploy to production:
```bash
netlify deploy --prod
```

### Method B: Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in

2. Click **"Add new site"** → **"Import an existing project"**

3. Connect your Git provider (GitHub, GitLab, or Bitbucket)

4. Select your repository

5. Configure build settings:
   - **Branch to deploy**: `master` or `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

6. Click **"Deploy site"**

7. Wait for deployment (usually 1-2 minutes)

8. Your app will be available at: `https://random-name.netlify.app`

9. (Optional) Change site name in **Site settings** → **Site details** → **Change site name**

### Netlify Configuration File

A `netlify.toml` file is included in the project with these settings:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Important Notes for Production Deployment

### Mock API Limitation

⚠️ **Important**: The current implementation uses `localhost:4001` and `localhost:4002` for mock APIs, which **will not work** in production.

For a production deployment, you have two options:

#### Option A: Deploy Mock APIs (Recommended for Demo)

1. **Deploy json-server instances**:
   - Use Railway, Render, or Heroku
   - Deploy two separate instances (one for each db file)
   - Get public URLs (e.g., `https://api1.railway.app`, `https://api2.railway.app`)

2. **Update API calls**:
   - Create `.env` file:
     ```
     VITE_API_BASIC_INFO_URL=https://api1.railway.app
     VITE_API_DETAILS_URL=https://api2.railway.app
     ```
   - Update `src/utils/api.ts` to use environment variables:
     ```typescript
     const API_BASIC_INFO = import.meta.env.VITE_API_BASIC_INFO_URL || 'http://localhost:4001';
     const API_DETAILS = import.meta.env.VITE_API_DETAILS_URL || 'http://localhost:4002';
     ```

3. **Add environment variables** in Vercel/Netlify dashboard

#### Option B: Use Mock Data (Quick Demo)

1. Create a mock adapter that returns static data instead of fetching
2. Useful for quick demos but loses dynamic functionality

### Recommended Approach for Assignment Submission

Since this is an assignment, the **easiest approach** is:

1. Deploy the frontend to Vercel/Netlify
2. In your README, note that the deployed version is a **UI demo** only
3. Provide instructions that the **full functionality** (API calls, data persistence) requires running locally with:
   - `npm run dev` (frontend)
   - `npm run api:step1` (mock API 1)
   - `npm run api:step2` (mock API 2)

This is acceptable for the assignment as the focus is on frontend implementation.

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test responsive design on different screen sizes
- [ ] Check that routing works (refresh on `/wizard` and `/employees`)
- [ ] Verify Inter font loads from Google Fonts
- [ ] Update README.md with your deployed URL
- [ ] Add deployment URL to your repository description
- [ ] Test the site in different browsers

## Updating the Deployment

### Vercel
Push changes to your Git repository - Vercel automatically redeploys on push to main branch.

Or manually redeploy:
```bash
vercel --prod
```

### Netlify
Push changes to your Git repository - Netlify automatically redeploys on push.

Or manually redeploy:
```bash
netlify deploy --prod
```

## Custom Domain (Optional)

Both Vercel and Netlify offer free custom domain setup:

1. Purchase a domain from a registrar (GoDaddy, Namecheap, etc.)
2. Go to your project settings
3. Add custom domain
4. Update DNS records as instructed

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: The `vercel.json` or `netlify.toml` file handles SPA routing. Make sure it's included in your repository.

### Issue: Build fails
**Solution**:
- Check build logs in dashboard
- Ensure `package.json` has correct scripts
- Verify Node version compatibility

### Issue: White screen after deployment
**Solution**:
- Check browser console for errors
- Verify all assets are loading
- Check if base URL is configured correctly

### Issue: Fonts not loading
**Solution**: Google Fonts should work automatically. Verify network tab shows successful font requests.

## Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com

For project-specific issues, check the README.md for local development setup.
