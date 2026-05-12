import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, type = "text", error, rightElement, ...props }, ref) => {
  return (
    <div className="w-full relative group">
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:ring-brand-primary/20 dark:focus:border-brand-primary/50",
          error && "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400 font-medium",
          rightElement && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-primary transition-colors cursor-pointer z-10">
          {rightElement}
        </div>
      )}
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";
