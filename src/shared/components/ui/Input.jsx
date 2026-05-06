import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:ring-brand-primary/50",
          error && "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";
