import type {
  ReactNode,
  ButtonHTMLAttributes,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-block rounded-full px-7 py-3.5 text-center font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-amber-500 text-white hover:bg-amber-600",

    secondary:
      "border border-purple-900 text-purple-900 hover:bg-purple-50",

    dark:
      "bg-purple-950 text-white hover:bg-purple-900",
  };

  const styles =
    `${baseStyles} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        className={styles}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...props}
      type={type}
      className={styles}
    >
      {children}
    </button>
  );
}