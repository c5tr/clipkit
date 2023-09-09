import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { getClipsByUserId } from "~/utils/clips.server";
import { requireUser } from "~/utils/sessions.server";
import { LoadingThumbnail } from "./loading-thumbnail";
import { useRef } from "react";
import type { Clip } from "@prisma/client";
import { ClipPreviewButton } from "./clip-preview-button";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const clips = await getClipsByUserId(user.id);
  return json(clips);
}

export default function App() {
  const revalidator = useRevalidator();
  const data = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement>(null);

  function openUploadDialog() {
    inputRef.current?.click();
  }

  async function startUpload() {
    const startUploadFormData = new FormData();
    startUploadFormData.append("filename", inputRef.current!.files![0].name);
    const shouldStartUpload = await fetch("/api/clip/upload/prepare", {
      method: "post",
      body: startUploadFormData,
    });
    if (!shouldStartUpload.ok) {
      // Handle failure
    }

    // Revalidate the data (to show a pending upload)
    revalidator.revalidate();

    // Upload the file
    const uploadMetadata: Clip = await shouldStartUpload.json();
    const fileFormData = new FormData();
    fileFormData.append("file", inputRef.current!.files![0]);
    const fileUpload = await fetch("/api/clip/upload/file/" + uploadMetadata.id, {
      method: "post",
      body: fileFormData,
    });
    if (!fileUpload.ok) {
      // wtf
    }

    // Update again
    revalidator.revalidate();
  }

  async function deleteClip(id: string) {
    const deleteReq = await fetch("/api/clip/delete/" + id, {
      method: "post",
    });
    if (!deleteReq.ok) {
      // stuff
    }
    revalidator.revalidate();
  }

  return (
    <>
      <input
        type="file"
        className="hidden"
        name="filename"
        ref={inputRef}
        accept=".webm,.mp4,.mov"
        onChange={startUpload}
      />
      <div
        className="flex w-full cursor-pointer justify-center rounded-lg border border-default px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        onClick={openUploadDialog}
      >
        Upload
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {data.map((clip) => (
          <div key={clip.id} className="flex flex-col gap-2">
            {clip.thumbnailUrl && (
              <img
                src={clip.thumbnailUrl}
                alt={`Thumbnail of ${clip.title}`}
                className="aspect-video rounded-lg object-cover border border-default"
              />
            )}
            {!clip.thumbnailUrl && <LoadingThumbnail />}
            <p className="line-clamp-1 overflow-ellipsis">{clip.title}</p>
            <div className="flex w-full flex-row overflow-hidden rounded-lg border border-default text-zinc-600 dark:text-zinc-300 [&>*]:flex-grow [&>*]:py-2">
              {clip.url && (
                <ClipPreviewButton border="right" href={"/" + clip.slug} icon="icon-[bi--play-fill]" />
              )}
              <ClipPreviewButton border="none" onClick={() => {}} icon="icon-[bi--pencil-square]" />
              {clip.url && (
                <ClipPreviewButton border="left" onClick={() => deleteClip(clip.id)} icon="icon-[bi--trash3]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}