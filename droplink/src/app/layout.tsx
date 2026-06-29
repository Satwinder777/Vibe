import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { Background } from "@/components/ui/Background";
import { CursorEffects } from "@/components/ui/CursorEffects";
import "./globals.css";
import { copy } from "@/lib/copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  keywords: ["file sharing", "cloud storage", "MEGA", "upload", "share link"],
  openGraph: {
    title: copy.metadata.title,
    description: copy.metadata.ogDescription,
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
