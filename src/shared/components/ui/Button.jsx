import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", size = "md", isLoading, children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] tap-highlight-transparent";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md shadow-brand-primary/10 dark:shadow-none",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    outline: "border-2 border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
    danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-950/30 dark:text-red-500 dark:hover:bg-red-900/40",
  };
  
  const sizes = {
    sm: "h-9 px-4 text-xs sm:text-sm",
    md: "h-11 px-6 text-sm sm:text-base",
    lg: "h-14 px-8 text-base sm:text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
