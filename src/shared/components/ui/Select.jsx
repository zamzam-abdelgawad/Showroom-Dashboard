import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export function Select({ options, value, onChange, placeholder, className, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 transition-all hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:bg-zinc-800",
          isOpen && "border-brand-primary/50 ring-2 ring-brand-primary/10"
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full animate-in fade-in zoom-in-95 duration-200 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left text-xs font-medium tracking-tight transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  value === option.value ? "text-brand-primary bg-brand-primary/5" : "text-zinc-600 dark:text-zinc-400"
                )}
              >
                {option.label}
                {value === option.value && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
