import { Link } from "@remix-run/react";
import { useState } from "react";

const accountMenuLinks = [
  {
    title: "Your clips",
    to: "/app",
    icon: "icon-[bi--camera-video-fill]",
  },
  {
    title: "Settings",
    to: "/app/settings",
    icon: "icon-[bi--gear-wide-connected]",
  },
  {
    title: "Log out",
    to: "/logout",
    icon: "icon-[bi--person-fill-x]",
  },
];

export function Header({ username }: { username?: string }) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <div className="flex select-none items-center justify-between gap-2 px-8 py-4">
      <Link to="/" className="flex items-center gap-2">
        <img src="/icon.svg" alt="Videoclip icon" className="h-8 dark:invert" />
        <p className="font-bold">clipkit</p>
        <span className="uppercase text-[0.6rem] self-start -ml-1">unstable</span>
      </Link>
      {username && (
        <div
          className="relative flex cursor-pointer items-center gap-2"
          onClick={() => setShowAccountMenu((v) => !v)}
        >
          <p>{username}</p>
          <div className="icon-[bi--triangle-fill] rotate-180 text-[0.4rem]" />
          {showAccountMenu && (
            <div className="absolute -right-2 top-10 flex w-48 flex-col overflow-hidden dark:border-zinc-700 rounded-lg border">
              {accountMenuLinks.map((item, index) => (
                <Link
                  to={item.to}
                  key={item.to}
                  className={`flex items-center gap-2 bg-white px-4 py-2 hover:bg-zinc-100 dark:bg-black dark:border-zinc-700 dark:hover:bg-zinc-900 ${
                    index != accountMenuLinks.length - 1 && "border-b"
                  }`}
                >
                  <div className={item.icon} />
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      {!username && <Link to="/login">Log in</Link>}
    </div>
  );
}
