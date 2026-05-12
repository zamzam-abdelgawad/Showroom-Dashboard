import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-xl z-10 animate-in fade-in zoom-in-95 duration-500 border border-zinc-100 dark:border-zinc-900 overflow-hidden">
        <div className="relative flex items-center justify-between px-10 py-8 border-b border-zinc-50 dark:border-zinc-900/50">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600" id="modal-title">{title}</h3>
            <div className="h-1 w-8 bg-brand-primary rounded-full" />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0 rounded-2xl text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300" aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-10 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
