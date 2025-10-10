import apiClient from "@/lib/apiClient";
import type {
  GetFaconniers,
  CreateFaconnier,
  DeleteFaconnier,
  UpdateFaconnier,
  UpdateFaconnierStatus,
  GetActiveFaconniers,
  CreateBonFaconnier,
  UpdateOrderFaconnier,
  CreateOrderFaconnier,
  GetOrdersFaconnier,
  CreateAvanceFaconnier,
  GetFaconnierSummary,
  DeleteAvanceFaconnier,
  DeleteOrderFaconnier,
  ToggleBonFaconnier,
  DeleteBonFaconnier,
  CancelOrderFaconnier,
} from "@/types/types";

export const faconnierService: {
  fetchFaconniers: GetFaconniers;
  createFaconnier: CreateFaconnier;
  deleteFaconnier: DeleteFaconnier;
  updateFaconnier: UpdateFaconnier;
  updateFaconnierStatus: UpdateFaconnierStatus;
  getActiveFaconniers: GetActiveFaconniers;
  createBonFaconnier: CreateBonFaconnier;
  updateOrderFaconnier: UpdateOrderFaconnier;
  createOrderFaconnier: CreateOrderFaconnier;
  getOrdersFaconnier: GetOrdersFaconnier;
  createAvanceFaconnier: CreateAvanceFaconnier;
  getFaconnierSummary: GetFaconnierSummary;
  deleteAvanceFaconnier: DeleteAvanceFaconnier;
  deleteOrderFaconnier: DeleteOrderFaconnier;
  toggleBonFaconnier: ToggleBonFaconnier;
  deleteBonFaconnier: DeleteBonFaconnier;
  cancelOrderFaconnier: CancelOrderFaconnier;
} = {
  fetchFaconniers: async (page, limit, search) => {
    try {
      const result = await apiClient.get(
        `/api/v1/faconnier/all?page=${page}&limit=${limit}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching faconniers:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  createFaconnier: async (userData) => {
    try {
      const result = await apiClient.post("/api/v1/faconnier/create", userData);
      return result.data;
    } catch (error: any) {
      console.error("Error creating faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  deleteFaconnier: async (faconnierId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/faconnier/delete/${faconnierId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  updateFaconnier: async (faconnierData) => {
    try {
      const { id, ...rest } = faconnierData;
      const result = await apiClient.put(
        `/api/v1/faconnier/update/${id}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error updating faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  updateFaconnierStatus: async ({ faconnierId, status }) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/faconnier/status/${faconnierId}`,
        { status }
      );
      return result.data;
    } catch (error: any) {
      console.error("Error updating faconnier status:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  getActiveFaconniers: async (seasonId, openBon, closedBon) => {
    try {
      const result = await apiClient.get(
        `/api/v1/faconnier/active/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching active faconniers:", error);
      return {
        status: "failed",
        message: "No response from server. Please try again later.",
      };
    }
  },

  createBonFaconnier: async (bonData) => {
    try {
      const { seasonId, faconnierId } = bonData;
      const result = await apiClient.post(
        `/api/v1/faconnier/bon/create/${seasonId}/${faconnierId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating bon faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  updateOrderFaconnier: async (updateOrderFaconnierData) => {
    try {
      const { orderId, seasonId, formData } = updateOrderFaconnierData;
      const result = await apiClient.patch(
        `/api/v1/faconnier/orders/update/${seasonId}/${orderId}`,
        formData
      );
      return result.data;
    } catch (error: any) {
      console.error("Error updating order faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  createOrderFaconnier: async (orderData) => {
    try {
      const { seasonId, faconnierId, ...rest } = orderData;
      const result = await apiClient.post(
        `/api/v1/faconnier/order/create/${seasonId}/${faconnierId}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating order faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  getOrdersFaconnier: async (seasonId, faconnierId, bonId, queryParams) => {
    try {
      const { page, limit, search, date } = queryParams!;
      const result = await apiClient.get(
        `/api/v1/faconnier/bon/details/${seasonId}/${faconnierId}/${bonId}?page=${page}&limit=${limit}&search=${search}&date=${date}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching orders faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  createAvanceFaconnier: async (avanceData) => {
    try {
      const { seasonId, faconnierId, bonId, ...rest } = avanceData;
      const result = await apiClient.post(
        `/api/v1/faconnier/avance/create/${seasonId}/${faconnierId}/${bonId}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating avance faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  getFaconnierSummary: async (seasonId, faconnierId, bonId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/faconnier/bon/summary/${seasonId}/${faconnierId}/${bonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching faconnier summary:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  deleteAvanceFaconnier: async (avanceId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/faconnier/avances/delete/${seasonId}/${avanceId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting avance faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  deleteOrderFaconnier: async (orderId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/faconnier/orders/delete/${seasonId}/${orderId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting order faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  toggleBonFaconnier: async (bonId, seasonId, openBon, closeBon) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/faconnier/bon/${seasonId}/${bonId}?openBon=${openBon}&closeBon=${closeBon}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error toggling bon faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  deleteBonFaconnier: async (bonId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/faconnier/bon/delete/${seasonId}/${bonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting bon faconnier:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "No response from server. Please try again later.",
      };
    }
  },

  cancelOrderFaconnier: async (orderId: string) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/faconnier/orders/cancel/${orderId}`
      );
      //console.log('Cancel order faconnier result:', result)
      return result.data;
    } catch (error: any) {
      console.error("Error canceling order faconnier:", error);
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },
};
