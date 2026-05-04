import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400",
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
