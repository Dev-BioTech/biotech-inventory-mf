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

  // HELPER: Map backend fields to frontend-friendly names for UI consistency
  mapBackendProduct: (item) => {
    if (!item) return null;

    const findKey = (searchKeys) => {
      const lowerKeys = Object.keys(item).map(k => k.toLowerCase());
      for (const k of searchKeys) {
        const idx = lowerKeys.indexOf(k.toLowerCase());
        if (idx !== -1) return item[Object.keys(item)[idx]];
      }
      return undefined;
    };

    const stock = Number(findKey(['currentquantity', 'quantity', 'stock', 'cantidad', 'currentstock', 'currentStock'])) || 0;
    const minStock = Number(findKey(['minimumstock', 'minstock'])) || 0;
    const price = Number(findKey(['averagecost', 'cost', 'price'])) || 0;
    const name = findKey(['name', 'nombre']) || "Sin nombre";
    const id = findKey(['id', 'productid', 'productId']);
    const rawCategory = findKey(['category', 'categoria']) || "General";
    const unit = findKey(['unitofmeasure', 'unit', 'unidad']) || "Unid";
    const active = findKey(['active', 'activo']) ?? true;

    // Traducir categorías del backend (inglés/enum) a español para la UI
    const categoryMap = {
      'feed': 'Alimento',
      'medicine': 'Medicamento',
      'tool': 'Herramienta',
      'tools': 'Herramienta',
      'supplement': 'Suplemento',
      'other': 'Otros',
      'others': 'Otros',
      // Por si viene como número (enum index)
      '0': 'Alimento',
      '1': 'Medicamento',
      '2': 'Herramienta',
      '3': 'Suplemento',
    };
    const category = categoryMap[String(rawCategory).toLowerCase()] || rawCategory;
    
    let status = "Óptimo";
    if (stock <= 0) status = "Agotado";
    else if (stock <= minStock * 0.5) status = "Crítico";
    else if (stock <= minStock) status = "Bajo";

    return {
      ...item,
      id: id,
      name: name,
      category: category,
      price: price,
      stock: stock,
      minStock: minStock,
      maxStock: minStock * 5, // Estimado
      unit: unit,
      status: status,
      supplier: item.Supplier ?? item.supplier ?? "Proveedor Local",
      active: active !== false
    };
  },

  // POST /api/v1/Products
  createProduct: async (productData) => {
    // 1. Map categories (strings) to Enums (integers)
    const categoryMap = {
      'Alimento': 0,
      'Medicamento': 1,
      'Herramientas': 2,
      'Herramienta': 2,
      'Equipo': 2,
      'Suplemento': 3,
      'Insumo': 3,
      'Otros': 3
    };

    const enumCategory = categoryMap[productData.category] ?? 3;
    
    let finalName = productData.name;
    if (enumCategory === 3 && productData.category && productData.category !== 'Otros') {
      finalName = `${productData.name} (${productData.category})`;
    }

    const rawId = parseInt(productData.farmId?.toString().split(':')[0], 10);
    const cleanFarmId = !isNaN(rawId) ? rawId : 0;

    const cleanedPayload = {
      FarmId: cleanFarmId,
      Name: finalName,
      Category: enumCategory,
      UnitOfMeasure: productData.unitOfMeasure || "Unit",
      CurrentQuantity: Number(productData.currentQuantity) || 0,
      AverageCost: Number(productData.averageCost) || 0,
      MinimumStock: Number(productData.minimumStock) || 0
    };

    const response = await apiClient.post("/v1/Products", cleanedPayload);
    const result = response.data?.data ?? response.data;
    return inventoryService.mapBackendProduct(result);
  },

  // GET /api/v1/Products?farmId={farmId}
  getProducts: async (farmId) => {
    if (!farmId) throw new Error("farmId is required to get products");
    // CLEANING
    const cleanId = typeof farmId === 'string' ? farmId.split(':')[0] : farmId;
    const response = await apiClient.get("/v1/Products", { params: { farmId: cleanId } });
    const data = response.data?.data ?? response.data;
    const items = Array.isArray(data) ? data : (data?.items ?? []);
    return items.map(inventoryService.mapBackendProduct);
  },

  // GET /api/v1/Products/{id}
  getProductById: async (id) => {
    const response = await apiClient.get(`/v1/Products/${id}`);
    const result = response.data?.data ?? response.data;
    return inventoryService.mapBackendProduct(result);
  },

  // GET /api/v1/Products/farms/{farmId}/low-stock
  getLowStockProducts: async (farmId) => {
    if (!farmId) throw new Error("farmId is required");
    // CLEANING
    const cleanId = typeof farmId === 'string' ? farmId.split(':')[0] : farmId;
    const response = await apiClient.get(`/v1/Products/farms/${cleanId}/low-stock`);
    const data = response.data?.data ?? response.data;
    const items = Array.isArray(data) ? data : (data?.items ?? []);
    return items.map(inventoryService.mapBackendProduct);
  },

  // PUT /api/v1/Products/{id}
  // Backend UpdateProductDto only accepts: Name, Category (enum int), UnitOfMeasure, MinimumStock
  updateProduct: async (id, updates) => {
    const categoryMap = {
      'Alimento': 0, 'feed': 0,
      'Medicamento': 1, 'medicine': 1,
      'Herramienta': 2, 'Herramientas': 2, 'tool': 2, 'tools': 2, 'Equipo': 2,
      'Suplemento': 3, 'supplement': 3, 'Insumo': 3, 'Otros': 3, 'other': 3,
    };

    const rawCat = updates.category || updates.Category || '';
    const categoryEnum = categoryMap[rawCat] ?? categoryMap[String(rawCat).toLowerCase()] ?? 3;

    const payload = {
      // Standard PascalCase for ASP.NET
      Name: updates.name || updates.Name,
      Category: categoryEnum,
      UnitOfMeasure: updates.unit || updates.unitOfMeasure || updates.UnitOfMeasure || 'Unit',
      MinimumStock: Number(updates.minStock ?? updates.minimumStock ?? updates.MinimumStock) || 0,
      CurrentQuantity: Number(updates.stock ?? updates.currentQuantity ?? updates.CurrentQuantity) || 0,
      AverageCost: Number(updates.price ?? updates.averageCost ?? updates.AverageCost) || 0,
      FarmId: updates.farmId || updates.FarmId,
      
      // Snake_case / lowercase variants for Mock API (json-server compatibility)
      name: updates.name || updates.Name,
      unit: updates.unit || updates.unitOfMeasure || updates.UnitOfMeasure || 'Unit',
      currentStock: Number(updates.stock ?? updates.currentQuantity ?? updates.CurrentQuantity) || 0,
      stock: Number(updates.stock ?? updates.currentQuantity ?? updates.CurrentQuantity) || 0,
      minStock: Number(updates.minStock ?? updates.minimumStock ?? updates.MinimumStock) || 0,
      price: Number(updates.price ?? updates.averageCost ?? updates.AverageCost) || 0,
      farmId: updates.farmId || updates.FarmId,
    };

    const response = await apiClient.put(`/v1/Products/${id}`, payload);
    const result = response.data?.data ?? response.data;
    return inventoryService.mapBackendProduct(result) ?? { ...updates, id };
  },

  // DELETE /api/v1/Products/{id}
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/v1/Products/${id}`);
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
