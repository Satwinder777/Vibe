# Deploy Guide — https://satwinder777.github.io/Vibe/

## Why 404?

The GitHub repo is **empty** — code was never pushed. Fix below.

---

## Step 1: Push code to GitHub

Open Terminal and run:

```bash
cd /Users/satwindersingh/Desktop/github/Vibe
git push -u origin main
```

If auth fails, use **GitHub Desktop** or login via:

```bash
gh auth login
# then
git push -u origin main
```

Or use SSH:
```bash
git remote set-url origin git@github.com:Satwinder777/Vibe.git
git push -u origin main
```

---

## Step 2: Add MEGA secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New secret**

| Name | Value |
|------|-------|
| `MEGA_EMAIL` | your MEGA email |
| `MEGA_PASSWORD` | your MEGA password |

---

## Step 3: Enable GitHub Pages

Repo → **Settings** → **Pages**

- **Source:** GitHub Actions

---

## Step 4: Trigger deploy

After push, workflow runs automatically. Or:

Repo → **Actions** → **Deploy to GitHub Pages** → **Run workflow**

---

## Alternative: Manual deploy (faster)

```bash
cd droplink
cp .env.example .env.local   # add MEGA credentials
npm install
npm run deploy
```

Then: **Settings** → **Pages** → Source: **Deploy from branch** → `gh-pages` / `/ (root)`

---

## Live URLs

| | URL |
|--|-----|
| App | https://satwinder777.github.io/Vibe/ |
| Share | https://satwinder777.github.io/Vibe/share/?id=YOUR_ID |
