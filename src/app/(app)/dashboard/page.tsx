/* eslint-disable @next/next/no-img-element */
import { AuthService } from "~/data/auth";
import { Uploader } from "./_uploader";
import Link from "next/link";
import { DeleteButton } from "./delete-button";
import { ClipsService } from "~/data/clips";

export default async function Home() {
  const user = await AuthService.requireUser();
  const clips = (await ClipsService.getAllByUser(user.id)).map((clip) => ({
    ...clip,
    thumbnailUrl: `${process.env.S3_PUBLIC_URL}/${clip.id}.webp`,
  }));

  return (
    <main>
      <Uploader />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {clips.map((clip) => (
          <div key={clip.id}>
            <img
              src={clip.thumbnailUrl}
              alt={"Thumbnail for " + clip.title}
              className="aspect-video w-full rounded-xl object-cover"
            />
            <h2 className="my-2 line-clamp-1 overflow-ellipsis font-bold">
              {clip.title}
            </h2>
            <div className="flex w-full overflow-hidden rounded-lg border border-black/20 dark:border-white/20 [&>*]:flex-grow">
              <Link
                href={"/v/" + clip.id}
                className="flex justify-center rounded-none border-r border-inherit py-[0.6rem] hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <div className="i-bi-play" />
              </Link>
              <DeleteButton id={clip.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
