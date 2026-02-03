# Deploy to Vercel

Every push to **master** should deploy to Vercel. Use one of these:

---

**If article image upload fails with "Method Not allowed" or 500:**  
Run the Storage policy in Supabase: **Dashboard → SQL Editor** → paste and run the contents of `supabase/migrations/009_storage_uploads_policy.sql`. Ensure the bucket is named **uploads** (lowercase) and is **public**.

## 1. Vercel Git (recommended)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project (or create one).
2. **Settings** → **Git** → connect **spectr.news.organization** if not already.
3. Set **Production Branch** to **master**.
4. Every push to `master` will trigger a new deployment automatically.

## 2. GitHub Action + Deploy Hook (backup)

If Git deploys don’t run, use a Deploy Hook:

1. **Vercel** → Project → **Settings** → **Git** → **Deploy Hooks** → **Create Hook** (branch: **master**) → copy the URL.
2. **GitHub** → this repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: the URL from step 1.
3. On every push to **master**, the workflow **Deploy to Vercel on push** runs and calls that URL, which triggers a Vercel deploy.

You can also run the workflow manually: **Actions** → **Deploy to Vercel on push** → **Run workflow**.
