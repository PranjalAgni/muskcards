import React from "react";

export function Button({
  children,
  className = "",
  variant = "solid",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  ariaLabel,
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    solid: "bg-rose-500 hover:bg-rose-600 text-white",
    outline: "border border-rose-300 text-rose-600 hover:bg-rose-50",
    ghost: "text-rose-500 hover:bg-rose-50",
  };

  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
    icon: "p-2 h-10 w-10",
  };

  const classes = [
    base,
    variants[variant] || variants.solid,
    sizes[size] || sizes.md,
    className,
  ].join(" ");

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}

export default Button;
