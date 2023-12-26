"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";

const links = [
  {
    title: "Your clips",
    href: "/dashboard",
  },
  {
    title: "Settings",
    href: "/settings",
  },
  {
    title: "Log out",
    href: "/logout",
  },
];

export function Menu() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleActionOutside);
    } else {
      document.removeEventListener("mousedown", handleActionOutside);
    }
  }, [showMenu]);

  function toggleMenu() {
    setShowMenu((v) => !v);
  }

  function handleActionOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (
      menuRef.current &&
      menuButtonRef.current &&
      !menuRef.current!.contains(target) &&
      !menuButtonRef.current!.contains(target)
    ) {
      setShowMenu(false);
    }
  }

  return (
    <>
      <div className="relative">
        <button
          className="flex aspect-square w-8 items-center justify-center rounded-lg hover:bg-black/10 hover:dark:bg-white/10"
          onClick={toggleMenu}
          ref={menuButtonRef}
        >
          <span className="i-bi-list" />
        </button>
        <div
          ref={menuRef}
          className={cn(
            "right-2 top-10 z-10 flex w-36 flex-col overflow-hidden rounded-lg border border-black/10 bg-zinc-100 drop-shadow-lg dark:border-white/10 dark:bg-zinc-900",
            showMenu ? "absolute" : "hidden",
          )}
        >
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={toggleMenu}
              className={`border-inherit px-4 py-2 hover:bg-black/10 hover:dark:bg-white/10 ${
                index != links.length - 1 ? "border-b" : ""
              }`}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
