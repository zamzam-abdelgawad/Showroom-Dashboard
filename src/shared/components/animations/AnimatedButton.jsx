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
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 tap-highlight-transparent";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-600",
    secondary: "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-100 border-2 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200 dark:shadow-none",
    outline: "border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
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
