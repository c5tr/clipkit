import { AuthService } from "~/data/auth";
import { Uploader } from "./uploader";

export default async function Home() {
  const user = await AuthService.requireUser();

  return <main>
    <Uploader />
  </main>;
}
