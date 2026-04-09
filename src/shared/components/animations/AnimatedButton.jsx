import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedButton({ children, className, variant = "primary", ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
      className={cn(baseStyles, variants[variant], "shadow-sm hover:shadow-lg transition-shadow", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
