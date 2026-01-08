"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message,
  fullScreen = false,
  className,
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50",
            fullScreen ? "fixed inset-0" : "absolute inset-0",
            className
          )}
        >
          <div className="relative">
            <div className="w-12 h-12 border-4 border-coral-200 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin" />
          </div>

          {message && (
            <p className="mt-4 text-sm text-gray-600">{message}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
