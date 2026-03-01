import apiClient from "../utils/apiClient";

export const inventoryService = {
  // ========== PRODUCTS ==========

  // POST /api/Products - Create a new product
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post("/Products", productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // GET /api/Products - Get products (Query: farmId)
  getProducts: async (farmId) => {
    try {
      const url = farmId ? `/Products?farmId=${farmId}` : "/Products";
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // GET /api/Products/low-stock - Get low stock products
  getLowStockProducts: async () => {
    try {
      const response = await apiClient.get("/Products/low-stock");
      return response.data;
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      throw error;
    }
  },

  // ========== INVENTORY ==========

  // POST /api/Inventory - Create inventory item
  createInventoryItem: async (inventoryData) => {
    try {
      const response = await apiClient.post("/Inventory", inventoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating inventory item:", error);
      throw error;
    }
  },

  // GET /api/Inventory/farm/{farmId} - Get inventory items by farm
  getInventoryByFarm: async (farmId) => {
    try {
      const response = await apiClient.get(`/Inventory/farm/${farmId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory for farm ${farmId}:`, error);
      throw error;
    }
  },

  // ========== INVENTORY MOVEMENTS ==========

  // POST /api/InventoryMovements - Register inventory movement (in/out)
  createInventoryMovement: async (movementData) => {
    try {
      const response = await apiClient.post(
        "/InventoryMovements",
        movementData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating inventory movement:", error);
      throw error;
    }
  },

  // GET /api/InventoryMovements/product/{productId} - Get movement history (Kardex) for a product
  getProductMovements: async (productId) => {
    try {
      const response = await apiClient.get(
        `/InventoryMovements/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching movements for product ${productId}:`,
        error
      );
      throw error;
    }
  },
};

export default inventoryService;
