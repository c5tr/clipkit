export default function Button({
  type,
  onClick,
  destructive,
  children,
}: {
  type?: "submit";
  onClick?: () => void;
  destructive?: boolean;
  children: React.ReactNode;
}) {
  const color = destructive ? "bg-red-500" : "bg-blue-500";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 ${color} text-white gap-2 flex flex-row rounded-xl justify-center`}
    >
      {children}
    </button>
  );
}
