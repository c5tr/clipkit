"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/button";
import { Spinner } from "~/components/spinner";

export function Uploader() {
  const [uploadsInProgress, setUploadsInProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onFilesSelected() {
    if (fileInputRef.current!.files!.length == 0) return;
    setUploadsInProgress((v) => v + fileInputRef.current!.files!.length);
  }

  return (
    <>
      <input
        type="file"
        accept=".mp4,.mov,.webm"
        className="hidden"
        multiple
        ref={fileInputRef}
        onChange={onFilesSelected}
      />
      <Button
        className={`w-full bg-zinc-100 dark:bg-zinc-900 ${
          uploadsInProgress > 0 ? "rounded-b-none" : ""
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload
      </Button>
      {uploadsInProgress > 0 && (
        <div className="flex items-center justify-center gap-4 rounded-b-lg bg-black/10 px-4 py-2 dark:bg-white/10">
          <Spinner />
          <span>
            Uploading {uploadsInProgress}{" "}
            {uploadsInProgress > 1 ? "files" : "file"}
          </span>
        </div>
      )}
    </>
  );
}
