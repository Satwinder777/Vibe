"use client";

// Always use the browser build — the default "megajs" export can resolve to the Node bundle in Next.js.
export {
  Storage,
  File,
  MutableFile,
} from "megajs/dist/main.browser-es.mjs";
