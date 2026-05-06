import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden dark:bg-zinc-950 dark:border-zinc-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-b border-zinc-100 dark:border-zinc-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-bold text-gray-900 leading-tight dark:text-zinc-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
