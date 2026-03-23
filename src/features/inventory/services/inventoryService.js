import apiClient from "@shared/utils/apiClient";

/**
 * Inventory Service — Full CRUD
 * All paths use /v1/ prefix matching ocelot.json upstream routes.
 *
 * Gateway routes:
 *   /api/v1/products/{everything}            → ProductsController (needs [Route("api/v1/products")])
 *   /api/v1/inventory/{everything}           → InventoryController
 *   /api/v1/inventory-movements/{everything} → InventoryMovementsController
 */
export const inventoryService = {

  // ── PRODUCTS ──────────────────────────────────────────────────────────────

  // POST /api/v1/products
  createProduct: async (productData) => {
    const response = await apiClient.post("/v1/products", productData);
    return response.data?.data ?? response.data;
  },

  // GET /api/v1/products?farmId={farmId}
  getProducts: async (farmId) => {
    if (!farmId) throw new Error("farmId is required to get products");
    const response = await apiClient.get("/v1/products", { params: { farmId } });
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },

  // GET /api/v1/products/{id}
  getProductById: async (id) => {
    const response = await apiClient.get(`/v1/products/${id}`);
    return response.data?.data ?? response.data;
  },

  // GET /api/v1/products/farms/{farmId}/low-stock
  getLowStockProducts: async (farmId) => {
    if (!farmId) throw new Error("farmId is required");
    const response = await apiClient.get(`/v1/products/farms/${farmId}/low-stock`);
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },

  // PUT /api/v1/products/{id}
  updateProduct: async (id, updates) => {
    const response = await apiClient.put(`/v1/products/${id}`, updates);
    return response.data?.data ?? response.data;
  },

  // DELETE /api/v1/products/{id}
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/v1/products/${id}`);
    return response.data;
  },

  // ── INVENTORY ─────────────────────────────────────────────────────────────

  // POST /api/v1/inventory
  createInventoryItem: async (inventoryData) => {
    const response = await apiClient.post("/v1/inventory", inventoryData);
    return response.data?.data ?? response.data;
  },

  // GET /api/v1/inventory/farm/{farmId}?page=&pageSize=
  getInventoryByFarm: async (farmId, params = {}) => {
    const response = await apiClient.get(`/v1/inventory/farm/${farmId}`, { params });
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },

  // ── INVENTORY MOVEMENTS ───────────────────────────────────────────────────

  // POST /api/v1/inventory-movements
  createInventoryMovement: async (movementData) => {
    const response = await apiClient.post("/v1/inventory-movements", movementData);
    return response.data?.data ?? response.data;
  },

  // GET /api/v1/inventory-movements/product/{productId}
  getProductMovements: async (productId) => {
    const response = await apiClient.get(`/v1/inventory-movements/product/${productId}`);
    const data = response.data;
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },
};

export default inventoryService;
