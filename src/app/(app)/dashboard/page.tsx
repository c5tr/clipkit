import { redirect } from "next/navigation";
import { AuthService } from "~/data/auth";

export default async function Home() {
  const user = await AuthService.requireUser();
  if (!user) redirect('/login');

  return <p>hello world</p>;
}
