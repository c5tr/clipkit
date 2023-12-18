/* eslint-disable @next/next/no-img-element */
import { AuthService } from "~/data/auth";
import { Uploader } from "./_uploader";
import { ClipsService } from "~/data/clips";
import { Spinner } from "~/components/spinner";
import Link from "next/link";
import { deleteClip } from "./_delete-button/actions";
import DeleteButton from "./_delete-button/delete-button";

export default async function Home() {
  const user = await AuthService.requireUser();
  const clips = await ClipsService.getAllByUser(user.id);

  return (
    <main>
      <Uploader />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {clips.map((clip) => (
          <div key={clip.id}>
            <img
              src={`${process.env.S3_PUBLIC_URL}/${clip.id}.webp`}
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
              <DeleteButton id={clip.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
