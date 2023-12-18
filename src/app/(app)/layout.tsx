/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AuthService } from "~/data/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await AuthService.requireUser(false);

  return (
    <body className={`mx-auto my-0 w-full max-w-4xl`}>
      <header className="flex w-full items-center justify-between px-6 py-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/icon.svg" alt="Videoclip icon" className="h-8 dark:invert"/>
          <h1 className="text-xl font-bold">clipkit</h1>
        </Link>
        { /* Leaving it like this for now because in the future there will be a menu instead of the log out link */}
        { user ? <Link href="/logout">Log out</Link> : <Link href="/login">Log in</Link>}
      </header>
      <div className="px-6 py-4">{children}</div>
    </body>
  );
}
