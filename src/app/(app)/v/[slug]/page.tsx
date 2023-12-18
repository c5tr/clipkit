import { ClipsService } from "~/data/clips";

export default async function VideoPlayer({ params }: { params: { slug: string } }) {
  const clip = await ClipsService.getClipById(params.slug);
  
  return <p>{JSON.stringify(params)}</p>;
}
