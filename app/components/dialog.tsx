export function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black bg-opacity-50 fixed w-full h-full left-0 top-0 flex items-center justify-center">
      <div className="mx-auto my-0 p-4 bg-white rounded-lg flex flex-col gap-2">{children}</div>
    </div>
  );
}
