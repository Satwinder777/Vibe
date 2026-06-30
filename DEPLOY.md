# Deploy Guide — https://satwinder777.github.io/Vibe/

Primary live URL. Builds always use base path `/Vibe` and app URL `https://satwinder777.github.io/Vibe`.

---

## One-time: Enable GitHub Pages

Open **[Satwinder777/Vibe → Settings → Pages](https://github.com/Satwinder777/Vibe/settings/pages)** and set:

| Setting | Value |
|---------|-------|
| **Source** | Deploy from a branch |
| **Branch** | `gh-pages` |
| **Folder** | `/ (root)` |

Save. The site goes live at **https://satwinder777.github.io/Vibe/** within 1–2 minutes.

> If you see a 404, Pages is not enabled yet — the build files are already on `gh-pages`.

---

## Deploy (manual)

```bash
cd droplink
npm run sync:portfolio   # updates Satwinder777.github.io/Vibe folder (portfolio site)
# or
npm run deploy           # pushes to gh-pages on Satwinder777/Vibe (recommended)
```

---

## Deploy (automatic on push)

Push to `main` — GitHub Actions builds and updates `gh-pages`.

Add secrets under **Settings → Secrets → Actions**:

| Name | Value |
|------|-------|
| `MEGA_EMAIL` | MEGA email |
| `MEGA_PASSWORD` | MEGA password |
| `FIREBASE_*` | Firebase config vars |
| `ACCESS_TOKEN` | Pro unlock token |

---

## Live URLs

| | URL |
|--|-----|
| App | https://satwinder777.github.io/Vibe/ |
| Share | https://satwinder777.github.io/Vibe/share/?id=YOUR_ID |
