import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "clipkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-zinc-50 text-black dark:bg-zinc-950 dark:text-white`}
    >
      {children}
    </html>
  );
}
