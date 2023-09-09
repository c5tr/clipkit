import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getClipBySlug } from "~/utils/clips.server";

export async function loader({ params }: LoaderArgs) {
  if (!params.slug) {
    throw new Response(null, {
      status: 404,
    });
  }
  const clip = await getClipBySlug(params.slug);
  if (!clip?.url) {
    throw new Response(null, {
      status: 404,
    });
  }
  return json(clip);
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.url) return [];
  return [
    { title: data.title },
    { property: "og:type", content: "video" },
    { property: "og:image", content: data.thumbnailUrl },
    { property: "og:video", content: data.url },
    { property: "og:video:type", content: data.url.endsWith(".webm") ? "video/webm" : "video/mp4" },
  ];
};

export function ErrorBoundary() {
  return (
    <div className="m-8 flex flex-col items-center gap-2 text-center">
      <div className="icon-[bi--camera-video-off] text-4xl" />
      <p>Clip not found</p>
    </div>
  );
}

export default function ClipDisplay() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <video src={data.url!} controls className="aspect-video" poster={data.thumbnailUrl!} />
      <p className="text-xl font-bold">{data.title!}</p>
    </div>
  );
}
