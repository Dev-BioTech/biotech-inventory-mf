import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryAlerts } from "./InventoryAlerts";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTable } from "./InventoryTable";
import { Modal } from "@/shared/components/ui/Modal";
import { InventoryForm } from "./InventoryForm";
import alertService, { showToast } from "@/shared/utils/alertService";

const InventorySkeleton = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* Header Skeleton */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
      <div className="space-y-3">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50">
        <div className="h-10 w-full bg-gray-50 rounded-xl animate-pulse" />
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-100 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function InventoryList() {
  const {
    loading,
    operationLoading,
    filteredProducts,
    stats,
    filters,
    actions,
  } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const product = filteredProducts.find((p) => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsModalOpen(true);
    }
  };

  const confirmDelete = async (id) => {
    const product = filteredProducts.find((p) => p.id === id);
    if (!product) return;

    const result = await alertService.deleteConfirm(`"${product.name}"`);
    
    if (result.isConfirmed) {
      const success = await actions.deleteProduct(id);
      if (success) {
        showToast(`Producto "${product.name}" eliminado correctamente`);
      } else {
        showToast("Error al eliminar el producto", "error");
      }
    }
  };

  const handleSubmit = async (formData) => {
    let success = false;

    if (editingProduct) {
      success = await actions.updateProduct(editingProduct.id, formData);
      if (success) showToast("Producto actualizado exitosamente");
    } else {
      success = await actions.addProduct(formData);
      if (success) showToast("Producto creado exitosamente");
    }

    if (success) {
      setIsModalOpen(false);
      setEditingProduct(null);
    } else {
      showToast("Ocurrió un error al guardar", "error");
    }
  };


  if (isModalOpen) {
    return (
      <InventoryForm
        product={editingProduct}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        loading={operationLoading}
      />
    );
  }
  return (
    <div className="space-y-6 font-sans relative">
      <InventoryHeader onCreate={handleCreate} />

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 rounded-xl" />
                    <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <InventoryStats stats={stats} />
          {stats && <InventoryAlerts stats={stats} />}
          <InventoryFilters
            searchTerm={filters.searchTerm}
            onSearchChange={filters.setSearchTerm}
            filterCategory={filters.filterCategory}
            onFilterChange={filters.setFilterCategory}
          />
          <InventoryTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </>
      )}
    </div>
  );
}
