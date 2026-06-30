"use client";

import { FlowField } from "./FlowField";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#04020e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_180%_120%_at_50%_-10%,#2a1060_0%,#1a0a3e_28%,#04020e_58%,#020108_100%)]" />
      <FlowField />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_30%,rgba(124,58,237,0.16),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_80%_60%,rgba(99,102,241,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,1,8,0.75)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#04020e]/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#04020e] to-transparent" />
    </div>
  );
}
