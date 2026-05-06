import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedButton({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  isLoading,
  disabled,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 tap-highlight-transparent rounded-xl";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-xl shadow-brand-primary/20",
    secondary: "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm font-bold",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200/20 dark:shadow-none font-bold",
    outline: "border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5 font-black",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs sm:text-sm",
    md: "h-11 px-6 text-sm sm:text-base",
    lg: "h-14 px-8 text-base sm:text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : children}
    </motion.button>
  );
}
