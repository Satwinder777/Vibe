# DropLink

Instant file sharing — static site on GitHub Pages, powered by MEGA cloud storage.

**Live:** [https://satwinder777.github.io/Vibe/](https://satwinder777.github.io/Vibe/)

Share link format: `https://satwinder777.github.io/Vibe/share/?id=YOUR_ID`

## Features

- Drag & drop upload directly to MEGA
- Instant shareable links
- Public download page (no login)
- Session history dashboard
- Dark / light mode
- Fully responsive

## Tech Stack

- Next.js 16 (static export)
- MEGA (`megajs` browser SDK)
- Tailwind CSS v4 + Framer Motion
- GitHub Pages + GitHub Actions

## Local Development

```bash
cd droplink
npm install
cp .env.example .env.local
# Add your MEGA credentials to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Local `.env.local`

```env
NEXT_PUBLIC_MEGA_EMAIL=your@email.com
NEXT_PUBLIC_MEGA_PASSWORD=your-password
NEXT_PUBLIC_MEGA_FOLDER_NAME=DropLink
```

## Deploy to GitHub Pages

1. Push to `main` branch on `Satwinder777/Vibe`
2. In GitHub repo → **Settings** → **Pages** → Source: **GitHub Actions**
3. Add repository secrets:
   - `MEGA_EMAIL` — your MEGA account email
   - `MEGA_PASSWORD` — your MEGA account password
4. Push triggers auto-deploy to `https://satwinder777.github.io/Vibe/`

## Share Links

Format: `https://satwinder777.github.io/Vibe/share/?id=abc12345`

## MEGA Setup

Files upload to a `DropLink` folder in your MEGA account root.  
Your folder: [mega.nz/fm/1r903RyB](https://mega.nz/fm/1r903RyB)

> **Note:** MEGA credentials are baked into the static build via GitHub Secrets. Use a dedicated MEGA account for this app.

## License

MIT
