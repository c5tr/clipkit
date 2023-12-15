export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`mx-auto my-0 w-full max-w-4xl`}>
      <header className="flex w-full items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">clipkit</h1>
        <div>username</div>
      </header>
      <div className="px-6 py-4">{children}</div>
    </body>
  );
}
