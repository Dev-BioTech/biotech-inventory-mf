import { useState, useEffect, useMemo } from "react";
import { inventoryService } from "../services/inventoryService";
import { STOCK_STATUS } from "@/shared/constants/inventoryConstants";

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
    try {
      setLoading(true);
      const data = await inventoryService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setOperationLoading(true);
      const newProduct = await inventoryService.createProduct(productData);
      setProducts((prev) => [newProduct, ...prev]);
      return true;
    } catch (error) {
      console.error("Failed to create product:", error);
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setOperationLoading(true);
      const updatedProduct = await inventoryService.updateProduct(
        id,
        productData,
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p)),
      );
      return true;
    } catch (error) {
      console.error("Failed to update product:", error);
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setOperationLoading(true);
      await inventoryService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
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
