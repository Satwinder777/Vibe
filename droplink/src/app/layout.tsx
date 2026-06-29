import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { Background } from "@/components/ui/Background";
import { CursorEffects } from "@/components/ui/CursorEffects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DropLink — Instant File Sharing",
  description:
    "Share files instantly. 1 free upload without signup, or create an account for unlimited uploads and file vault.",
  keywords: ["file sharing", "cloud storage", "MEGA", "upload", "share link"],
  openGraph: {
    title: "DropLink — Instant File Sharing",
    description: "Share any file instantly with a single link.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <CursorProvider>
              <ToastProvider>
                <Background />
                <CursorEffects />
                {children}
              </ToastProvider>
            </CursorProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
