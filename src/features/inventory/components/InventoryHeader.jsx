import { Plus, Boxes } from "lucide-react";
import { motion } from "framer-motion";

export function InventoryHeader({ onCreate }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl md:rounded-3xl group shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)] mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative max-md:min-h-[180px] md:h-52 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2670&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-teal-900/90 to-emerald-800/80" />
        <div className="relative h-full flex flex-col justify-center max-md:px-6 md:px-10 max-md:py-8 md:py-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex max-md:flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-emerald-400/20 rounded-xl backdrop-blur-md">
                  <Boxes className="w-6 h-6 md:w-8 md:h-8 text-emerald-300" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Gestión de Inventarios
                </h1>
              </div>
              <p className="text-emerald-100/90 max-md:text-sm md:text-lg max-w-xl font-medium">
                Control de insumos, medicamentos y alimentos con trazabilidad en tiempo real.
              </p>
            </div>

            <div className="flex max-sm:flex-col sm:flex-row gap-3 max-sm:w-full w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreate}
                className="flex justify-center items-center gap-2 max-sm:w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] border border-emerald-400/50 font-bold max-sm:py-3 sm:py-2.5 px-6 rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Registrar Producto
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
