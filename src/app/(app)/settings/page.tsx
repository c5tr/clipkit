import { AuthService } from "~/data/auth";
import { UpdatePassword } from "./_password";

export default async function Settings() {
  const user = await AuthService.requireUser();

  return (
    <>
      <h2 className="text-xl font-bold">Settings</h2>
      <hr className="my-2 opacity-30" />
      <div className="grid gap-4 md:grid-cols-2">
        <UpdatePassword />
      </div>
    </>
  );
}
