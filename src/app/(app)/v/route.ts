import { redirect } from "next/navigation";

export function GET() {
  throw redirect("/");
}
