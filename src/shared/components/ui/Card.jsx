import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-100 dark:border-slate-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900 leading-tight dark:text-gray-100", className)} {...props}>
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
