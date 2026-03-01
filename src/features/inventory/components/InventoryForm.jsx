import { useState, useEffect } from "react";
import {
  PRODUCT_CATEGORIES,
  STOCK_STATUS,
} from "@/shared/constants/inventoryConstants";
import { Save, Settings, PackageOpen, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export function InventoryForm({ product, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    unit: "",
    minStock: "",
    maxStock: "",
    price: "",
    supplier: "",
    status: "Óptimo",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        stock: product.stock,
        unit: product.unit,
        minStock: product.minStock,
        maxStock: product.maxStock,
        price: product.price,
        supplier: product.supplier,
        status: product.status,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      price: Number(formData.price),
    };
    onSubmit(submissionData);
  };

  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm text-sm";
  const labelStyles =
    "flex flex-col gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";

  const isEditing = Boolean(product);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full my-4 md:my-6 bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden"
    >
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl group shadow-lg">
        <div
          className="relative min-h-[180px] md:h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="relative h-full flex flex-col justify-center px-6 md:px-8 py-6 md:py-0 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-300/20 rounded-xl backdrop-blur-md">
                    <PackageOpen className="w-6 h-6 md:w-8 md:h-8 text-green-300" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                    {isEditing ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                </div>
                <p className="text-green-100/80 text-sm md:text-lg max-w-xl font-medium">
                  {isEditing
                    ? "Actualice los datos o existencias del producto."
                    : "Añada un nuevo producto a su inventario maestro."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-10 lg:p-14 space-y-10 md:space-y-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
                IDENTIDAD DEL PRODUCTO
              </h3>
            </div>
            <div>
              <label className={labelStyles}>Nombre del Producto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputStyles}
                placeholder="Ej: Vacuna Antiaftosa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                >
                  <option value="">Seleccionar...</option>
                  {Object.values(PRODUCT_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyles}>Proveedor</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  required
                  className={inputStyles}
                  placeholder="Ej: VetMed Corp"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 md:w-6 md:h-6 text-green-600 rounded flex items-center justify-center bg-green-50 overflow-hidden">
                <span className="text-[10px] font-bold">#</span>
              </div>
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
                CANTIDADES Y STOCK
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Stock Actual</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Unidad de Medida</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  placeholder="KG, LT, UNIDADES"
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Stock Mínimo</label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  required
                  min="0"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Stock Máximo</label>
                <input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleChange}
                  required
                  min="0"
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex items-start gap-3 mt-4">
              <span className="text-blue-500 text-lg mt-0.5 font-black uppercase">
                i
              </span>
              <p className="text-blue-800 text-xs sm:text-sm font-medium leading-relaxed">
                El sistema te alertará automáticamente cuando las existencias
                actuales alcancen este límite mínimo.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: METRICS */}
        <div className="bg-gray-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100/50 space-y-8 md:space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 md:w-6 md:h-6 text-green-600 rounded flex items-center justify-center bg-green-50 overflow-hidden">
              <span className="text-xs font-bold">$</span>
            </div>
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
              VALORACIÓN Y ESTADO ACTUAL
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <label className={labelStyles}>Precio Unitario</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">
                  $ USD
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={`${inputStyles} pr-12`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="Óptimo">ÓPTIMO</option>
                <option value="Bajo">BAJO</option>
                <option value="Crítico">CRÍTICO</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all text-center"
            >
              DESCARTAR CAMBIOS
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-4 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-[#1a5a35] hover:bg-[#134428] text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-green-900/40 transition-all border border-green-400/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-green-300" />
                  {product ? "CONFIRMAR" : "CONFIRMAR REGISTRO"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
