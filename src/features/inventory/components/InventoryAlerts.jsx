import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function InventoryAlerts({ stats }) {
  if (stats.lowStock === 0 && stats.criticalStock === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 border border-red-100 flex items-start gap-4"
    >
      <div className="bg-white p-2 rounded-full shadow-sm mt-1">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <div>
        <h3 className="text-red-900 font-semibold text-sm uppercase tracking-wide">
          Atención Requerida
        </h3>
        <p className="text-red-700 text-sm mt-1">
          Hay <span className="font-bold">{stats.criticalStock} productos</span>{" "}
          en estado crítico y{" "}
          <span className="font-bold">{stats.lowStock}</span> con stock bajo que
          requieren reabastecimiento.
        </p>
      </div>
    </motion.div>
  );
}
