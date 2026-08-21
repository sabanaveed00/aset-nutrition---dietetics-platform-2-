import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface SlidingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "right" | "left" | "bottom";
  footer?: React.ReactNode;
  icon?: React.ReactNode;
}

export const SlidingDrawer: React.FC<SlidingDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "md",
  position = "right",
  footer,
  icon,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const widthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full",
  }[width];

  const variants = {
    right: {
      hidden: { x: "100%", opacity: 0.8 },
      visible: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
    },
    left: {
      hidden: { x: "-100%", opacity: 0.8 },
      visible: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
    },
    bottom: {
      hidden: { y: "100%", opacity: 0.8 },
      visible: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
    },
  }[position];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            id="drawer-backdrop"
          />

          {/* Sliding Panel */}
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={`relative w-full ${widthClasses} bg-[#0f0f0f] text-[#ededed] border-l border-[#222222] shadow-2xl flex flex-col z-50 h-full ${
              position === "bottom" ? "rounded-t-3xl max-h-[85vh] self-end border-t border-l-0" : ""
            }`}
            id="sliding-drawer-panel"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 rounded-xl bg-[#1a1a1a] text-teal-400 border border-teal-900/40">
                    {icon}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white text-base sm:text-lg">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-[#888888] mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                id="drawer-close-button"
                className="p-2 text-[#888888] hover:text-[#ededed] hover:bg-[#222222] rounded-xl transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0f0f0f]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-[#222222] bg-[#141414]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
