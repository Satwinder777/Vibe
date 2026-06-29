import {
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileCode,
} from "lucide-react";
import { getFileCategory, type FileCategory } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<FileCategory, typeof File> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  pdf: FileText,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive,
  code: FileCode,
  other: File,
};

const COLOR_MAP: Record<FileCategory, string> = {
  image: "text-pink-400 bg-pink-500/10",
  video: "text-purple-400 bg-purple-500/10",
  audio: "text-blue-400 bg-blue-500/10",
  pdf: "text-red-400 bg-red-500/10",
  document: "text-sky-400 bg-sky-500/10",
  spreadsheet: "text-emerald-400 bg-emerald-500/10",
  archive: "text-amber-400 bg-amber-500/10",
  code: "text-violet-400 bg-violet-500/10",
  other: "text-muted bg-surface-elevated",
};

interface FileIconProps {
  filename: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FileIcon({ filename, className, size = "md" }: FileIconProps) {
  const category = getFileCategory(filename);
  const Icon = ICON_MAP[category];
  const colorClass = COLOR_MAP[category];

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg [&>svg]:h-4 [&>svg]:w-4",
    md: "h-10 w-10 rounded-xl [&>svg]:h-5 [&>svg]:w-5",
    lg: "h-14 w-14 rounded-2xl [&>svg]:h-7 [&>svg]:w-7",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      <Icon />
    </div>
  );
}
