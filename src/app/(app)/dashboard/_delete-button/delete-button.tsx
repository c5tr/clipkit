"use client";

import { deleteClip } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await deleteClip(id);
      }}
      className="flex justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900"
    >
      <div className="i-bi-trash3" />
    </button>
  );
}
