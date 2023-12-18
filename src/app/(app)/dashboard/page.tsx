/* eslint-disable @next/next/no-img-element */
import { AuthService } from "~/data/auth";
import { getClips } from "./actions";
import ClientSideDashboard from "./_content";

export default async function Home() {
  const user = await AuthService.requireUser();
  const clips = await getClips(user.id);

  return (
    <main>
      <ClientSideDashboard initialState={clips} userId={user.id} />
    </main>
  );
}
