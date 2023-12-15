export default function VideoPlayer({ params }: { params: { slug: string } }) {
  return <p>{JSON.stringify(params)}</p>;
}
