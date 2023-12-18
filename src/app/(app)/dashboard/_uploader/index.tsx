import { useRef, useState } from "react";
import { Button } from "~/components/button";
import { Spinner } from "~/components/spinner";
import { createUpload } from "./actions";

export function Uploader({ reload }: { reload: () => void }) {
  const [uploadsInProgress, setUploadsInProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function onFilesSelected() {
    if (fileInputRef.current!.files!.length == 0) return;
    setUploadsInProgress((v) => v + fileInputRef.current!.files!.length);
    for (let i = 0; i < fileInputRef.current!.files!.length; i++) {
      const uploadInfo = await createUpload(
        fileInputRef.current!.files![i].name,
      );
      console.log(uploadInfo);
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
        if (uploadFinishReq.ok) reload();
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
        className={`w-full bg-zinc-100 dark:bg-zinc-900 ${
          uploadsInProgress > 0 ? "hidden" : ""
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload
      </Button>
      {uploadsInProgress > 0 && (
        <div className="flex items-center justify-center gap-4 rounded-lg bg-black/10 px-4 py-2 dark:bg-white/10">
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
