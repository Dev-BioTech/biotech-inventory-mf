import apiClient from "@shared/utils/apiClient";

/**
 * Feature-level Inventory Service
 * Uses the shared apiClient (baseURL = /api already set).
 *
 * Products   → GET/POST /api/Products
 * Inventory  → GET/POST /api/Inventory
 * Movements  → GET/POST /api/InventoryMovements
 */
export const inventoryService = {
  // ── POST /api/Products ────────────────────────────────────────────────
  createProduct: async (productData) => {
    const response = await apiClient.post("/Products", productData);
    return response.data;
  },

  // ── GET /api/Products?farmId=... ──────────────────────────────────────
  // farmId is required by the backend
  getProducts: async (farmId) => {
    if (!farmId) throw new Error("farmId is required to get products");
    const response = await apiClient.get("/Products", { params: { farmId } });
    const data = response.data;
    // Support both array response and { data: [] } / { items: [] }
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },

  // ── GET /api/Products/low-stock?farmId=... ────────────────────────────
  getLowStockProducts: async (farmId) => {
    if (!farmId) throw new Error("farmId is required");
    const response = await apiClient.get("/Products/low-stock", {
      params: { farmId },
    });
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },

  // ── PUT (update) — no dedicated PUT in docs, use POST with id if backend supports ──
  // Keeping method for frontend compatibility. Adjust path if backend adds PUT /Products/{id}
  updateProduct: async (id, updates) => {
    const response = await apiClient.put(`/Products/${id}`, updates);
    return response.data;
  },

  // ── DELETE /api/Products/{id} ─────────────────────────────────────────
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/Products/${id}`);
    return response.data;
  },

  // ── POST /api/Inventory ───────────────────────────────────────────────
  createInventoryItem: async (inventoryData) => {
    const response = await apiClient.post("/Inventory", inventoryData);
    return response.data;
  },

  // ── GET /api/Inventory/farm/{farmId} ─────────────────────────────────
  getInventoryByFarm: async (farmId, params = {}) => {
    const response = await apiClient.get(`/Inventory/farm/${farmId}`, {
      params,
    });
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },

  // ── POST /api/InventoryMovements ──────────────────────────────────────
  createInventoryMovement: async (movementData) => {
    const response = await apiClient.post("/InventoryMovements", movementData);
    return response.data;
  },

  // ── GET /api/InventoryMovements/product/{productId} ───────────────────
  getProductMovements: async (productId) => {
    const response = await apiClient.get(
      `/InventoryMovements/product/${productId}`,
    );
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },
};

export default inventoryService;
