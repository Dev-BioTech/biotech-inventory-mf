import {
  Package,
  TrendingDown,
  AlertTriangle,
  Search,
  Trash2,
  Edit2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PRODUCT_CATEGORIES,
  STOCK_STATUS,
} from "@/shared/constants/inventoryConstants";

export function InventoryTable({ products, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Óptimo":
      case STOCK_STATUS.AVAILABLE:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Bajo":
      case STOCK_STATUS.LOW:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Crítico":
      case STOCK_STATUS.CRITICAL:
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Bajo":
      case STOCK_STATUS.LOW:
        return <TrendingDown className="w-3.5 h-3.5" />;
      case "Crítico":
      case STOCK_STATUS.CRITICAL:
        return <AlertTriangle className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Alimento":
      case PRODUCT_CATEGORIES.FEED:
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Medicamento":
      case PRODUCT_CATEGORIES.MEDICINE:
        return "bg-red-50 text-red-700 border-red-100";
      case "Forraje":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Suplemento":
      case PRODUCT_CATEGORIES.SUPPLEMENT:
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-transparent">
              <th className="text-left py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Producto
              </th>
              <th className="text-left py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Categoría
              </th>
              <th className="text-left py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Disponibilidad
              </th>
              <th className="text-left py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Precio Unit.
              </th>
              <th className="text-left py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Proveedor
              </th>
              <th className="text-left py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Estado
              </th>
              <th className="text-right py-5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                className="hover:bg-gray-50/80 transition-colors group"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors border border-transparent group-hover:border-emerald-100">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">
                        {product.name}
                      </p>
                      <p className="text-gray-400 text-[10px] font-medium tracking-tight">
                        ID: #{String(product.id).padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getCategoryColor(product.category)}`}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold">
                      {product.stock} {product.unit}
                    </span>
                    <span className="text-gray-400 text-[10px] font-medium">
                      Min: {product.minStock} / Max: {product.maxStock}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-gray-900 font-black">
                  ${product.price.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                </td>
                <td className="py-5 px-6 text-gray-500 font-medium">
                  {product.supplier || "—"}
                </td>
                <td className="py-5 px-6">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold ${getStatusColor(product.status)}`}
                  >
                    {getStatusIcon(product.status)}
                    {product.status.toUpperCase()}
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="p-2.5 bg-white border border-gray-100 hover:border-emerald-500 hover:text-emerald-600 text-gray-400 rounded-xl transition-all shadow-sm hover:shadow-emerald-100"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2.5 bg-white border border-gray-100 hover:border-red-500 hover:text-red-600 text-gray-400 rounded-xl transition-all shadow-sm hover:shadow-red-100"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-black text-xl mb-2">
              Inventario vacío
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              No hay productos que coincidan con los filtros actuales.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
