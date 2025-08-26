import type {
  CreateOrderClientFromReturnStock,
  DeleteClientReturnStock,
  GetReturnStock,
  GetSummaryReturnStock,
  UpdateClientReturnStock,
} from "@/types/types";
import apiClient from "@/lib/apiClient";

export const returnStockService: {
  fetchReturnStock: GetReturnStock;
  deleteClientReturnStock: DeleteClientReturnStock;
  updateClientReturnStock: UpdateClientReturnStock;
  getSummaryReturnStock: GetSummaryReturnStock;
  createOrderClientFromReturnStock: CreateOrderClientFromReturnStock;
} = {
  fetchReturnStock: async ({ page, limit, search, seasonId }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/stock-return/all/${seasonId}?page=${page}&limit=${limit}&search=${search}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
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

  deleteClientReturnStock: async (clientReturnId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/stock-return/delete/${seasonId}/${clientReturnId}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
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

  updateClientReturnStock: async (updateOrderClientData) => {
    const { seasonId, clientReturnId, newQuantity } = updateOrderClientData;

    try {
      const result = await apiClient.put(
        `/api/v1/stock-return/update/${seasonId}/${clientReturnId}`,
        { newQuantity }
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
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

  getSummaryReturnStock: async (seasonId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/stock-return/summary/${seasonId}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
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

  createOrderClientFromReturnStock: async (orderClientData) => {
    const { seasonId, clientId, ...restData } = orderClientData;

    try {
      const result = await apiClient.post(
        `/api/v1/stock-return/order/create/${seasonId}/${clientId}`,
        restData
      );

      if (result.status === 201) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
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
