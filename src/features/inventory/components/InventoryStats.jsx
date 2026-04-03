import { Archive, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function InventoryStats({ stats }) {
  const cards = [
    {
      label: "Total Productos",
      value: stats.totalProducts,
      icon: Archive,
      color: "emerald",
      delay: 0.1,
    },
    {
      label: "Valor Total",
      value: `$${stats.totalValue.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "blue",
      delay: 0.2,
    },
    {
      label: "Stock Bajo",
      value: stats.lowStock,
      icon: Activity,
      color: "yellow",
      delay: 0.3,
    },
    {
      label: "Críticos",
      value: stats.criticalStock,
      icon: AlertTriangle,
      color: "red",
      delay: 0.4,
    },
  ];

  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group transition-all duration-300 hover:shadow-md"
        >
          <div className={`inline-flex p-3 rounded-2xl ${colors[card.color]} mb-4 transition-colors group-hover:bg-opacity-80`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{card.label}</p>
            <p className="text-2xl font-black text-gray-800 mt-1">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
