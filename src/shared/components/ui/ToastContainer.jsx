import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useToastStore } from "@/shared/store/toastStore";

const toastTypes = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 text-green-800 border-green-200",
    iconClass: "text-green-500",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 text-red-800 border-red-200",
    iconClass: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 text-yellow-800 border-yellow-200",
    iconClass: "text-yellow-500",
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const type = toastTypes[toast.type] || toastTypes.success;
          const Icon = type.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              layout
              className={`min-w-[300px] p-4 rounded-xl shadow-lg border flex items-center gap-3 pointer-events-auto ${type.className}`}
            >
              <Icon className={`w-5 h-5 ${type.iconClass}`} />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
