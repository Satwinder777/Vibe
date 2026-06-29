"use client";

import { FlowField } from "./FlowField";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#04020e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,#1a0a3e_0%,#04020e_50%,#020108_100%)]" />
      <FlowField />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,rgba(88,28,135,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,1,8,0.88)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#04020e]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04020e] to-transparent" />
    </div>
  );
}
