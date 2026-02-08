# Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: GitHub Integration (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Pre-Deployment Checklist

- ✅ All dependencies installed (`npm install`)
- ✅ Build succeeds locally (`npm run build`)
- ✅ No TypeScript errors
- ✅ Environment variables configured (if any)
- ✅ Test the app locally (`npm run dev`)

## Build Locally

To test the production build:

```bash
npm run build
npm start
```

## Environment Variables

No environment variables are required for basic functionality.

If you need to add custom environment variables:
1. Create `.env.local` file (already in .gitignore)
2. Add your variables
3. In Vercel dashboard, go to Settings → Environment Variables
4. Add the same variables

## Custom Domain

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Run `npm run build` locally to see errors
- Check Vercel build logs

### API Routes Not Working
- Ensure files are in `app/api/` directory
- Check route.ts exports are correct
- Verify POST/GET methods are properly defined

### Styles Not Loading
- Verify Tailwind CSS is properly configured
- Check `tailwind.config.ts` paths
- Ensure `globals.css` imports are correct

## Performance Optimization

The app is already optimized for Vercel:
- ✅ Static generation where possible
- ✅ API routes for server-side logic
- ✅ Lightweight dependencies
- ✅ No external database required
- ✅ Recharts with lazy loading

## Monitoring

After deployment:
- Check Vercel Analytics for performance
- Monitor API route response times
- Review any runtime errors in Vercel logs

## Cost

This application runs perfectly on Vercel's **FREE tier**:
- Unlimited deployments
- 100GB bandwidth per month
- Serverless functions included
- Automatic HTTPS

---

Need help? Check the [Vercel Documentation](https://vercel.com/docs) or create an issue in the repository.
