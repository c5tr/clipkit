export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`mx-auto my-0 w-full max-w-7xl`}>
      <div className="px-6 py-4">{children}</div>
    </body>
  );
}
