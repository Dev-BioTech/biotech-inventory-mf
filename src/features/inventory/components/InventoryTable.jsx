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
        return "bg-green-100 text-green-700 border-green-200";
      case "Bajo":
      case STOCK_STATUS.LOW:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Crítico":
      case STOCK_STATUS.CRITICAL:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Bajo":
      case STOCK_STATUS.LOW:
        return <TrendingDown className="w-4 h-4" />;
      case "Crítico":
      case STOCK_STATUS.CRITICAL:
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Alimento":
      case PRODUCT_CATEGORIES.FEED:
        return "bg-blue-100 text-blue-700";
      case "Medicamento":
      case PRODUCT_CATEGORIES.MEDICINE:
        return "bg-red-100 text-red-700";
      case "Forraje":
        return "bg-green-100 text-green-700";
      case "Suplemento":
      case PRODUCT_CATEGORIES.SUPPLEMENT:
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rango
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50/80 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">
                        {product.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        ID: #{product.id.padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getCategoryColor(product.category)}`}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold">
                      {product.stock}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {product.unit}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500 text-sm">
                  {product.minStock} - {product.maxStock}
                </td>
                <td className="py-4 px-6 text-gray-900 font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-gray-500 text-sm">
                  {product.supplier}
                </td>
                <td className="py-4 px-6">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(product.status)}`}
                  >
                    {getStatusIcon(product.status)}
                    {product.status}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="p-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 rounded-lg transition-all shadow-sm cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 text-gray-600 rounded-lg transition-all shadow-sm cursor-pointer"
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
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 text-sm">
              Intenta ajustar tu búsqueda o filtros
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
