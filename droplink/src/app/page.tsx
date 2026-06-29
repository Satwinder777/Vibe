"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { UploadZone } from "@/components/sections/UploadZone";
import { FileDashboard } from "@/components/sections/FileDashboard";
import { HowItWorks } from "@/components/sections/HowItWorks";
import type { UploadResult } from "@/lib/types";

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = useCallback((_result: UploadResult) => {
    setRefreshTrigger((n) => n + 1);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <UploadZone onUploadComplete={handleUploadComplete} />
        <FileDashboard refreshTrigger={refreshTrigger} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
