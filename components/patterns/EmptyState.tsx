"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-6"
        >
          {icon}
        </motion.div>
      )}

      <h3 className="text-xl font-display text-brown-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-400 text-white rounded-full font-medium shadow-lg shadow-coral-500/25 hover:shadow-xl transition-shadow"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
