import { AuthService } from "~/data/auth";
import { ClipsService } from "~/data/clips";
import { S3Service } from "~/data/s3";
import { revalidatePath } from "next/cache";

export function DeleteButton({ id }: { id: string }) {
  async function deleteClip() {
    "use server";

    const user = await AuthService.requireUser();
    const clip = await ClipsService.getClipById(id, user.id);
    if (!clip) return;
    await ClipsService.deleteClip(id);
    await S3Service.deleteObjects(`${id}.${clip.videoFormat}`, `${id}.webp`);
    revalidatePath("/");
  }

  return (
    <form className="hover:bg-zinc-100 dark:hover:bg-zinc-900">
      <button formAction={deleteClip} className="flex justify-center w-full py-[0.6rem]">
        <div className="i-bi-trash3" />
      </button>
    </form>
  );
}
