import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryAlerts } from "./InventoryAlerts";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTable } from "./InventoryTable";
import { Modal } from "@/shared/components/ui/Modal";
import { InventoryForm } from "./InventoryForm";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { ToastContainer } from "@/shared/components/ui/ToastContainer";
import { useToastStore } from "@/shared/store/toastStore";

export default function InventoryList() {
  const {
    loading,
    operationLoading,
    filteredProducts,
    stats,
    filters,
    actions,
  } = useInventory();

  const { addToast } = useToastStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

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

  const confirmDelete = (id) => {
    const product = filteredProducts.find((p) => p.id === id);
    if (product) {
      setProductToDelete(product);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    const success = await actions.deleteProduct(productToDelete.id);
    if (success) {
      addToast(`Producto "${productToDelete.name}" eliminado correctamente`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } else {
      addToast("Error al eliminar el producto", "error");
    }
  };

  const handleSubmit = async (formData) => {
    let success = false;

    if (editingProduct) {
      success = await actions.updateProduct(editingProduct.id, formData);
      if (success) addToast("Producto actualizado exitosamente");
    } else {
      success = await actions.addProduct(formData);
      if (success) addToast("Producto creado exitosamente");
    }

    if (success) {
      setIsModalOpen(false);
      setEditingProduct(null);
    } else {
      addToast("Ocurrió un error al guardar", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans relative">
      <ToastContainer />

      <InventoryHeader onCreate={handleCreate} />

      <InventoryStats stats={stats} />

      <InventoryAlerts stats={stats} />

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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <InventoryForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={operationLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar producto?"
        message={`Estás a punto de eliminar "${productToDelete?.name}". Esta acción no se puede deshacer.`}
        isLoading={operationLoading}
      />
    </div>
  );
}
