import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      ease: [0.4, 0, 0.2, 1], 
      duration: 0.5 
    } 
  },
};

export function StaggeredGrid({ children, className = "", ...props }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`grid gap-4 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredCard({ children, className = "", ...props }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
