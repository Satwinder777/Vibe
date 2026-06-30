# DropLink

Instant file sharing — static site on GitHub Pages, powered by MEGA cloud storage.

**Live:** [https://satwinder777.github.io/Vibe/](https://satwinder777.github.io/Vibe/)

Share link format: `https://satwinder777.github.io/Vibe/share/?id=YOUR_ID`

## Features

- Sign up / sign in with Firebase Auth
- Drag & drop upload directly to MEGA (requires login)
- Instant shareable links
- Personal upload history (per account)
- Public download page (no login for recipients)
- Dark / light mode with glassmorphism UI
- Fully responsive

## Tech Stack

- Next.js 16 (static export)
- MEGA (`megajs` browser SDK)
- Firebase Auth + Firestore
- Tailwind CSS v4 + Framer Motion
- GitHub Pages + GitHub Actions

## Local Development

```bash
cd droplink
npm install
cp .env.example .env.local
# Add MEGA + Firebase credentials to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** and **Anonymous** authentication
3. Create a **Firestore** database
4. Add Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /uploads/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

5. Copy web app config into `.env.local` (see `.env.example`)

### Local `.env.local`

```env
NEXT_PUBLIC_MEGA_EMAIL=your@email.com
NEXT_PUBLIC_MEGA_PASSWORD=your-password
NEXT_PUBLIC_MEGA_FOLDER_NAME=vibe
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... rest of Firebase vars
```

## Deploy to GitHub Pages

1. Push to `main` branch on `Satwinder777/Vibe`
2. In GitHub repo → **Settings** → **Pages** → Branch: `gh-pages` / `(root)`
3. Add repository secrets (for Actions builds):
   - `MEGA_EMAIL` / `MEGA_PASSWORD`
   - `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`
   - `ACCESS_TOKEN` — your private pro unlock token (same as `NEXT_PUBLIC_ACCESS_TOKEN` locally)
4. Push triggers auto-deploy to `https://satwinder777.github.io/Vibe/`

## Share Links

Format: `https://satwinder777.github.io/Vibe/share/?id=abc12345`

## MEGA Setup

Files upload to a `vibe` folder in your MEGA account root.

> **Note:** MEGA credentials are baked into the static build via GitHub Secrets. Use a dedicated MEGA account for this app.

## License

MIT
