import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCT_CATEGORIES } from "@/shared/constants/inventoryConstants";

export function InventoryFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl shadow-sm p-4 border border-gray-100 mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, código..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 text-gray-700 placeholder-gray-400 font-bold outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 min-w-[240px] w-full md:w-auto bg-gray-50/50 px-4 py-1 rounded-2xl border border-transparent focus-within:border-emerald-100 focus-within:bg-white transition-all">
          <Filter className="w-5 h-5 text-gray-300" />
          <select
            value={filterCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full py-2 bg-transparent border-none text-gray-700 font-bold cursor-pointer outline-none transition-all appearance-none"
          >
            <option value="all">Filtro: Todo</option>
            {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
