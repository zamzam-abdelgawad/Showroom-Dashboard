import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function SmoothAccordion({ title, children, defaultOpen = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`overflow-hidden border border-gray-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-white dark:bg-slate-900 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800/50 focus:outline-none transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.4 }}
          >
            <div className="p-5 border-t border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
