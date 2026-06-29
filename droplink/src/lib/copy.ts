/** User-facing copy — keep tone clear, confident, and product-grade. */

export const copy = {
  brand: {
    name: "DropLink",
    tagline: "Secure file sharing, built for speed.",
  },

  nav: {
    upload: "Upload",
    features: "Features",
    signIn: "Sign in",
    signUp: "Get started",
    signUpFree: "Get started free",
    trialUsed: "Trial complete",
    freeUpload: "1 free transfer",
  },

  hero: {
    badgeMember: "Member · Unlimited transfers",
    badgeTrialUsed: "Guest trial complete",
    badgeGuest: "Try once — no account required",
    headline: "Share files in a",
    headlineAccent: "flow.",
    descMember:
      "Upload without limits, manage your vault, and distribute secure share links in seconds.",
    descGuest:
      "Send one file free, no signup required. Create an account to unlock unlimited transfers and a personal file vault.",
    ctaUpload: "Start uploading",
    ctaAccount: "Create your account",
    ctaFree: "Try a free transfer",
    ctaFeatures: "Explore features",
    trustInstant: "Instant share links",
    trustEncrypted: "MEGA-encrypted storage",
    trustCloud: "Cloud-backed delivery",
  },

  upload: {
    toastFreeUsed: "Guest transfer used. Sign in to continue uploading.",
    toastGuestLimit: "Guest accounts are limited to one file per session.",
    toastMegaMissing: "Storage is not configured. Please try again later.",
    toastVaultFail: (detail: string) =>
      `File uploaded, but vault sync failed: ${detail}`,
    toastGuestDone: "Transfer complete. Create an account for unlimited uploads.",
    toastLinkCopied: "Share link copied to clipboard.",
    bannerUsedTitle: "Guest transfer used",
    bannerUsedDesc:
      "You've used your complimentary upload. Sign in or create an account for unlimited transfers and vault access.",
    bannerGuestTitle: "Guest access · One complimentary transfer",
    bannerGuestDesc:
      "Upload a single file without registering. You'll receive a share link instantly — vault history requires an account.",
    lockedTitle: "Guest transfer limit reached",
    lockedDesc:
      "Create a free account to unlock unlimited uploads, vault management, and upcoming premium features.",
    lockedCta: "Create free account",
    dragRelease: "Release to upload",
    dragGuest: "Drop your file to begin",
    dragMember: "Drag and drop your files here",
    dragOr: "or",
    dragBrowse: "browse from your device",
    pillOneFile: "Single file",
    pillMulti: "Batch upload",
    pillMega: "Encrypted storage",
    pillInstant: "Instant link",
    linkReady: "Share link generated",
    copy: "Copy",
  },

  vault: {
    title: "Your vault",
    loading: "Loading your files…",
    empty: "No files in your vault yet",
    emptyHint: "Upload a file above and it will appear here automatically.",
    count: (n: number) =>
      `${n} file${n === 1 ? "" : "s"} in your vault`,
    toastCopied: "Share link copied to clipboard.",
    toastDeleted: "File removed from your vault.",
    toastDeleteFail: "Unable to delete this file. Please try again.",
    toastLoadFail: "Unable to load your vault. Please refresh and try again.",
  },

  auth: {
    createTitle: "Create your account",
    signInTitle: "Welcome back",
    createDesc: "Register to unlock unlimited uploads and your personal file vault.",
    signInDesc: "Sign in to access your vault and upload history.",
    notConfigured:
      "Authentication is not available on this deployment. Contact the site administrator.",
    passwordMin: "Password must be at least 6 characters.",
    accountCreated: "Account created. You're ready to upload.",
    welcomeBack: "Signed in successfully.",
    email: "Email",
    password: "Password",
    emailPlaceholder: "name@company.com",
    createCta: "Create account",
    signInCta: "Sign in",
    hasAccount: "Already have an account?",
    newHere: "New to DropLink?",
    switchSignIn: "Sign in",
    switchSignUp: "Create an account",
  },

  features: {
    eyebrow: "Capabilities",
    title: "Built for today.",
    titleAccent: "Ready for what comes next.",
    descMember:
      "You have full access to every live feature. More capabilities are on the way.",
    descGuest:
      "Start with one complimentary transfer. Unlock the full platform with a free account.",
    available: "Available now",
    comingSoon: "On the roadmap",
    live: "Live",
    soon: "Soon",
  },

  featureItems: {
    instantUpload: {
      title: "Instant upload",
      desc: "Drop any file and receive a shareable link within seconds.",
    },
    publicLinks: {
      title: "Public share links",
      desc: "Recipients can view and download instantly — no account required.",
    },
    freeTransfer: {
      title: "Complimentary transfer",
      desc: "Evaluate the platform with one guest upload before you register.",
    },
    unlimited: {
      title: "Unlimited transfers",
      desc: "Upload as many files as you need with a registered account.",
    },
    vault: {
      title: "Personal vault",
      desc: "Review, copy, and manage every file you've shared — all in one place.",
    },
    passwordLinks: {
      title: "Password-protected links",
      desc: "Add an access code before sharing sensitive files.",
    },
    aliases: {
      title: "Custom link aliases",
      desc: "Replace random IDs with branded, memorable URLs.",
    },
    expiry: {
      title: "Automatic link expiry",
      desc: "Set a TTL and let share links expire on your schedule.",
    },
    teams: {
      title: "Team workspaces",
      desc: "Collaborate in shared folders with role-based permissions.",
    },
    analytics: {
      title: "Transfer analytics",
      desc: "Monitor views, downloads, and link performance over time.",
    },
    api: {
      title: "Developer API",
      desc: "Embed DropLink uploads directly into your own applications.",
    },
    e2e: {
      title: "Client-side encryption",
      desc: "Encrypt files before they leave the browser for zero-knowledge storage.",
    },
  },

  share: {
    back: "Back to DropLink",
    loading: "Retrieving file…",
    notFoundTitle: "File unavailable",
    notFoundDefault: "This link may be invalid or the file has been removed.",
    noId: "No file identifier was provided in this link.",
    uploadNew: "Upload a new file",
    sharedVia: "Shared via DropLink",
    size: "Size",
    type: "Type",
    uploaded: "Uploaded",
    download: "Download file",
    copyLink: "Copy link",
    toastCopied: "Share link copied to clipboard.",
    toastDownload: "Download started.",
    toastDownloadFail: "Download failed. Please try again.",
    footer: "Secure file sharing",
  },

  footer: {
    builtWith: "Built with",
    builtBy: "by Satwinder",
  },

  heroVisual: {
    fileName: "quarterly-report.pdf",
    fileMeta: "Uploaded · 2.1 MB",
    fileStatus: "Complete",
    linkTitle: "Share link ready",
    linkUrl: "droplink.io/share/xK9m2p",
    imageAlt: "Abstract digital flow visualization",
  },

  metadata: {
    title: "DropLink — Secure File Sharing",
    description:
      "Share files instantly with encrypted cloud storage. One complimentary guest transfer, or register for unlimited uploads and a personal vault.",
    ogDescription:
      "Upload, share, and manage files with secure links — powered by MEGA cloud storage.",
  },
} as const;
