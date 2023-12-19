export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="mx-auto my-0 w-full max-w-lg p-8">
      <main className="w-full rounded-lg border border-black/10 bg-white dark:bg-zinc-900 p-6 dark:border-white/10">
        {children}
      </main>
    </body>
  );
}
