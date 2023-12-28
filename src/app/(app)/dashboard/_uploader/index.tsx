"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/button";
import { Spinner } from "~/components/spinner";
import { createUpload } from "./actions";
import { useRouter } from "next/navigation";

export function Uploader() {
  const router = useRouter();
  const [uploadsInProgress, setUploadsInProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function onFilesSelected() {
    if (fileInputRef.current!.files!.length == 0) return;
    setUploadsInProgress((v) => v + fileInputRef.current!.files!.length);
    for (let i = 0; i < fileInputRef.current!.files!.length; i++) {
      const uploadInfo = await createUpload(
        fileInputRef.current!.files![i].name,
      );
      const uploadReq = await fetch(uploadInfo.uploadUrl, {
        method: "PUT",
        body: fileInputRef.current!.files![i],
      });
      if (uploadReq.ok) {
        // finish upload
        const uploadFinishReq = await fetch("/api/upload/finish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: uploadInfo.id,
          }),
        });
        if (uploadFinishReq.ok) router.refresh();
      }
      // show errors
      setUploadsInProgress((v) => v - 1);
    }
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
        variant="outlined"
        className={`w-full ${uploadsInProgress > 0 ? "hidden" : ""}`}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload
      </Button>
      {uploadsInProgress > 0 && (
        <div className="flex items-center justify-center gap-4 rounded-lg  border border-zinc-300 bg-transparent px-4 py-2 text-black dark:border-0 dark:bg-zinc-900 dark:text-white">
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
