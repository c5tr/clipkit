import { revalidatePath } from "next/cache";
import { requireUser } from "~/data/auth";
import { deleteClip, getClipById } from "~/data/clips";
import { deleteObjects } from "~/data/s3";

export function DeleteButton({ id }: { id: string }) {
  async function action() {
    "use server";

    const user = await requireUser();
    const clip = await getClipById(id, user.id);
    if (!clip) return;
    await deleteClip(id);
    await deleteObjects(`${id}.${clip.videoFormat}`, `${id}.webp`);
    revalidatePath("/");
  }

  return (
    <form className="hover:bg-zinc-100 dark:hover:bg-zinc-900">
      <button formAction={action} className="flex justify-center w-full py-[0.6rem]">
        <div className="i-bi-trash3" />
      </button>
    </form>
  );
}
