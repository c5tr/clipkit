"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Clip, deleteClip, getClips } from "../actions";
import Link from "next/link";
import { Uploader } from "../_uploader";

export default function ClientSideDashboard({
  userId,
  initialState,
}: {
  userId: number;
  initialState: Clip[];
}) {
  const [clips, setClips] = useState<Clip[] | undefined>();

  async function reload() {
    const updatedClips = await getClips(userId);
    setClips(updatedClips);
  }

  return (
    <>
      <Uploader reload={reload} />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(clips ?? initialState).map((clip) => (
          <div key={clip.id}>
            <img
              src={clip.thumbnailUrl}
              alt={"Thumbnail for " + clip.title}
              className="aspect-video w-full rounded-xl object-cover"
            />
            <h2 className="my-2 line-clamp-1 overflow-ellipsis font-bold">
              {clip.title}
            </h2>
            <div className="flex w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 [&>*]:flex-grow [&>*]:py-[0.6rem]">
              <Link
                href={"/v/" + clip.id}
                className="flex justify-center rounded-none border-r border-inherit hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <div className="i-bi-play" />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await deleteClip(clip.id);
                  reload();
                }}
                className="flex justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <div className="i-bi-trash3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
