import { Archive, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function InventoryStats({ stats }) {
  const cards = [
    {
      label: "Total Productos",
      value: stats.totalProducts,
      icon: Archive,
      color: "blue",
      delay: 0.1,
    },
    {
      label: "Valor Inventario",
      value: `$${stats.totalValue.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "green",
      delay: 0.2,
    },
    {
      label: "Stock Bajo",
      value: stats.lowStock,
      icon: Activity,
      color: "yellow",
      textColor: "text-yellow-600",
      delay: 0.3,
    },
    {
      label: "Críticos",
      value: stats.criticalStock,
      icon: AlertTriangle,
      color: "red",
      textColor: "text-red-600",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
            <p
              className={`text-2xl font-bold ${card.textColor || "text-gray-800"}`}
            >
              {card.value}
            </p>
          </div>
          <div
            className={`w-12 h-12 bg-${card.color}-50 text-${card.color}-600 rounded-xl flex items-center justify-center`}
          >
            <card.icon className="w-6 h-6" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
