import { cn } from "../../lib/utils";
import { CheckCircle, XCircle, Info } from "lucide-react";

export function Toast({ type = "info", message }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgColors = {
    success: "bg-white border-green-200",
    error: "bg-white border-red-200",
    info: "bg-white border-blue-200"
  };

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all animate-in slide-in-from-bottom-5", bgColors[type])}>
      {icons[type]}
      <p className="text-sm font-medium text-gray-800">{message}</p>
    </div>
  );
}
