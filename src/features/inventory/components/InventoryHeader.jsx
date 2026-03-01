import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function InventoryHeader({ onCreate }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-2xl font-bold text-green-900 mb-1">Inventario</h1>
        <p className="text-green-600 text-sm">
          Gestión general de productos e insumos
        </p>
      </motion.div>

      <motion.button
        onClick={onCreate}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer font-medium"
      >
        <Plus className="w-5 h-5" />
        Agregar Producto
      </motion.button>
    </div>
  );
}
