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
      className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, código..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 text-gray-700 placeholder-gray-400 font-medium outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500/20 text-gray-700 font-medium cursor-pointer outline-none transition-all"
          >
            <option value="all">Todas las categorías</option>
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
