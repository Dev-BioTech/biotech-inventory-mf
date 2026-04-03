import { useState, useEffect, useMemo } from "react";
import { inventoryService } from "../services/inventoryService";
import alertService from "@/shared/utils/alertService";
import { STOCK_STATUS } from "@/shared/constants/inventoryConstants";

/** Read farmId from the shared auth-storage (Zustand persist key) */
function getFarmId() {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.selectedFarm?.id ?? null;
  } catch {
    return null;
  }
}

export function useInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const farmId = getFarmId();
    if (!farmId) {
      console.warn("useInventory: no farmId found, skipping fetch");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await inventoryService.getProducts(farmId);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load inventory:", error);
      alertService.error("Error al cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setOperationLoading(true);
      const farmId = getFarmId();
      const productWithFarm = { ...productData, farmId };
      const newProduct = await inventoryService.createProduct(productWithFarm);
      setProducts((prev) => [newProduct, ...prev]);
      return true;
    } catch (error) {
      console.error("Failed to create product:", error);
      const msg = error.response?.data?.message || "Error al crear el producto";
      alertService.error(msg);
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setOperationLoading(true);
      const farmId = getFarmId();

      // 1. Update Name, Category, UnitOfMeasure, MinimumStock (fields backend accepts)
      const updatedProduct = await inventoryService.updateProduct(id, productData);

      // 2. If stock changed, register an INVENTORY_ADJUSTMENT movement
      const currentProduct = products.find((p) => p.id === id);
      const newStock = Number(productData.stock ?? productData.currentQuantity ?? 0);
      const oldStock = Number(currentProduct?.stock ?? 0);
      const stockDiff = newStock - oldStock;

      if (stockDiff !== 0) {
        const movementPayload = {
          ProductId: id,
          Concept: 6, // INVENTORY_ADJUSTMENT enum index
          Direction: stockDiff > 0 ? 0 : 1, // 0=ENTRY, 1=EXIT
          Quantity: Math.abs(stockDiff),
          UnitCost: Number(productData.price ?? productData.averageCost ?? currentProduct?.price ?? 0),
          Observations: "Ajuste desde formulario de edición",
        };
        try {
          await inventoryService.createInventoryMovement(movementPayload);
        } catch (movErr) {
          console.warn("Stock adjustment movement failed:", movErr);
        }
      }

      // 3. Build a merged product object for local state (backend only returns Name/Category/etc.)
      const mergedProduct = {
        ...currentProduct,
        ...updatedProduct,
        stock: newStock,
        price: Number(productData.price ?? productData.averageCost ?? currentProduct?.price ?? 0),
      };

      // Recalculate status
      const minSt = mergedProduct.minStock || 0;
      if (mergedProduct.stock <= 0) mergedProduct.status = "Agotado";
      else if (mergedProduct.stock <= minSt * 0.5) mergedProduct.status = "Crítico";
      else if (mergedProduct.stock <= minSt) mergedProduct.status = "Bajo";
      else mergedProduct.status = "Óptimo";

      setProducts((prev) => prev.map((p) => (p.id === id ? mergedProduct : p)));
      return true;
    } catch (error) {
      console.error("Failed to update product:", error);
      alertService.error("Error al actualizar el producto");
      return false;
    } finally {
      setOperationLoading(false);
    }
  };


  const deleteProduct = async (id) => {
    try {
      const confirmed = await alertService.confirm(
        "¿Estás seguro?",
        "Esta acción no se puede deshacer",
      );
      if (!confirmed) return false;

      setOperationLoading(true);
      await inventoryService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
      alertService.error("Error al eliminar el producto");
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterCategory === "all" || product.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filterCategory]);

  const stats = useMemo(
    () => ({
      totalProducts: products.length,
      totalValue: products.reduce((acc, p) => acc + p.price * p.stock, 0),
      lowStock: products.filter(
        (p) => p.status === "Bajo" || p.status === STOCK_STATUS.LOW,
      ).length,
      criticalStock: products.filter(
        (p) => p.status === "Crítico" || p.status === STOCK_STATUS.CRITICAL,
      ).length,
    }),
    [products],
  );

  return {
    loading,
    operationLoading,
    products,
    filteredProducts,
    stats,
    filters: {
      searchTerm,
      setSearchTerm,
      filterCategory,
      setFilterCategory,
    },
    actions: {
      reload: loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
    },
  };
}
