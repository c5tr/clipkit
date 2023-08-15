export default function TextInput({
  type,
  name,
  placeholder,
}: {
  type?: React.HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="rounded-xl border px-4 py-2 dark:bg-zinc-900 dark:border-zinc-700"
    />
  );
}
