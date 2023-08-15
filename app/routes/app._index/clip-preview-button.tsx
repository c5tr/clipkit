import { Link } from "@remix-run/react";

export function ClipPreviewButton({
  icon,
  border,
  href,
  onClick,
}: {
  icon: string;
  border: "left" | "right" | "none";
  href?: string;
  onClick?: () => void;
}) {
  const baseClasses =
    "flex cursor-pointer items-center justify-center hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";
  const borderClasses = {
    left: "border-l",
    right: "border-r",
    none: "",
  };
  const classes = `${baseClasses} ${borderClasses[border]}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        <div className={icon} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <div className={classes} onClick={onClick}>
        <div className={icon} />
      </div>
    );
  }

  throw Error();
}
