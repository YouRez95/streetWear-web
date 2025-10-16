import apiClient from "@/lib/apiClient";
import { getMimeTypeFromFileName } from "@/lib/utils";
import type {
  CreateProduct,
  DeleteProduct,
  GetAllProductsStatus,
  GetProducts,
  UpdateProduct,
} from "@/types/types";

export const productService: {
  fetchProducts: GetProducts;
  createProduct: CreateProduct;
  updateProduct: UpdateProduct;
  deleteProduct: DeleteProduct;
  getAllProductsStatus: GetAllProductsStatus;
} = {
  fetchProducts: async ({ page, limit, search, seasonId, date }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/product/all/${seasonId}?page=${page}&limit=${limit}&search=${search}&date=${date}`
      );

      if (result.status === 200) return result.data;

      return {
        status: "failed",
        message: "Unexpected response from server.",
        products: [],
        currentPage: 0,
        totalPages: 0,
      };
    } catch (error: any) {
      console.error("Error fetching products:", error);
      const { status, data } = error.response || {};

      if (status === 400 && data?.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
          products: [],
          currentPage: 0,
          totalPages: 0,
        };
      }

      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
        products: [],
        currentPage: 0,
        totalPages: 0,
      };
    }
  },

  createProduct: async (product, seasonId) => {
    try {
      const formData = new FormData();
      const fields = [
        "name",
        "reference",
        "type",
        "totalQty",
        "description",
        "createdAt",
        "poids",
        "metrage",
      ];
      fields.forEach((key) =>
        formData.append(key, (product as any)[key] || "")
      );

      if (product.productImage) {
        const mimeType = getMimeTypeFromFileName(product.fileName || "");
        const blob = new Blob([product.productImage], { type: mimeType });
        formData.append("productImage", blob, product.fileName || "image.png");
      }

      const result = await apiClient.post(
        `/api/v1/product/create/${seasonId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.status === 201) {
        return {
          status: "success",
          message: result.data.message,
          product: result.data.product,
        };
      }

      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error creating product:", error);
      const { status, data } = error.response || {};
      if (status === 400 && data?.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },

  updateProduct: async (product, seasonId) => {
    try {
      const formData = new FormData();
      const fields = [
        "name",
        "reference",
        "type",
        "totalQty",
        "description",
        "createdAt",
        "poids",
        "metrage",
      ];
      fields.forEach((key) =>
        formData.append(key, (product as any)[key] || "")
      );

      if (product.productImage) {
        const mimeType = getMimeTypeFromFileName(product.fileName || "");
        const blob = new Blob([product.productImage], { type: mimeType });
        formData.append("productImage", blob, product.fileName || "image.png");
      }

      const result = await apiClient.put(
        `/api/v1/product/update/${seasonId}/${product.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          product: result.data.product,
        };
      }

      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error updating product:", error);
      const { status, data } = error.response || {};
      if (status === 400 && data?.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },

  deleteProduct: async (productId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/product/delete/${seasonId}/${productId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      const { status, data } = error.response || {};
      if (status === 400 && data?.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },

  getAllProductsStatus: async (seasonId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/product/all/status/${seasonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error getting all products status:", error);
      const { status, data } = error.response || {};
      if (status === 400 && data?.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },
};
