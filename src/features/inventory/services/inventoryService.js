import { MOCK_PRODUCTS } from "@/shared/mocks/inventoryMock";

const USE_MOCK = true;

// Simular persistencia local para que los cambios se mantengan durante la sesión
let currentProducts = [...MOCK_PRODUCTS];

export const inventoryService = {
  getProducts: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return currentProducts;
    }
  },

  createProduct: async (product) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      currentProducts = [newProduct, ...currentProducts];
      return newProduct;
    }
  },

  updateProduct: async (id, updates) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentProducts = currentProducts.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      );
      return currentProducts.find((p) => p.id === id);
    }
  },

  deleteProduct: async (id) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentProducts = currentProducts.filter((p) => p.id !== id);
      return true;
    }
  },
};
