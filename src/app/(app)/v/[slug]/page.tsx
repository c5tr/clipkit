import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ClipsService } from "~/data/clips";

const cachedGetClipById = cache(
  async (id: string) => await ClipsService.getClipById(id),
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const clip = await cachedGetClipById(params.slug);
  if (!clip) notFound();

  return {
    title: clip.title,
  };
}

export default async function VideoPlayer({
  params,
}: {
  params: { slug: string };
}) {
  const clip = await cachedGetClipById(params.slug);
  if (!clip) notFound();

  return (
    <>
      <video
        src={`${process.env.S3_PUBLIC_URL}/${params.slug}.${clip.videoFormat}`}
        poster={`${process.env.S3_PUBLIC_URL}/${params.slug}.webp`}
        className="aspect-video w-full"
        controls
      />
      <h2 className="mt-4 font-bold">{clip.title}</h2>
    </>
  );
}
