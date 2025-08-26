import apiClient from "@/lib/apiClient";
import type {
  GetStylists,
  CreateStylist,
  UpdateStylist,
  UpdateStylistStatus,
  DeleteStylist,
  GetActiveStylists,
  CreateBonStylist,
  CreateOrderStylist,
  CreateAvanceStylist,
  GetOrdersStylist,
  UpdateOrderStylist,
  DeleteOrderStylist,
  DeleteAvanceStylist,
  ToggleBonStylist,
  DeleteBonStylist,
  GetStylistSummary,
} from "@/types/types";

export const stylistService: {
  getStylists: GetStylists;
  createStylist: CreateStylist;
  updateStylist: UpdateStylist;
  updateStylistStatus: UpdateStylistStatus;
  deleteStylist: DeleteStylist;
  getActiveStylists: GetActiveStylists;
  createBonStylist: CreateBonStylist;
  createOrderStylist: CreateOrderStylist;
  createAvanceStylist: CreateAvanceStylist;
  getOrdersStylist: GetOrdersStylist;
  updateOrderStylist: UpdateOrderStylist;
  deleteOrderStylist: DeleteOrderStylist;
  deleteAvanceStylist: DeleteAvanceStylist;
  toggleBonStylist: ToggleBonStylist;
  deleteBonStylist: DeleteBonStylist;
  getStylistSummary: GetStylistSummary;
} = {
  getStylists: async (types, page, limit, searchTerm) => {
    let type = "";
    if (types.length === 1) {
      type = types[0].slice(0, -1);
    }
    try {
      const result = await apiClient.get(
        `/api/v1/stylist/all?page=${page}&limit=${limit}&search=${searchTerm}&type=${type}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching stylists:", error);
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

  createStylist: async (stylist) => {
    try {
      const result = await apiClient.post("/api/v1/stylist/create", stylist);
      if (result.status === 201) {
        return {
          status: "success",
          message: result.data.message,
          stylist: result.data.stylist,
        };
      }
      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error creating stylist:", error);
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

  updateStylist: async (stylist) => {
    const { id, ...rest } = stylist;
    try {
      const result = await apiClient.put(`/api/v1/stylist/update/${id}`, rest);
      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          stylist: result.data.stylist,
        };
      }
      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error updating stylist:", error);
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

  updateStylistStatus: async ({ stylistId, status }) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/stylist/status/${stylistId}`,
        { status }
      );
      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          stylist: result.data.stylist,
        };
      }
      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error updating stylist status:", error);
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

  deleteStylist: async (stylistId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/stylist/delete/${stylistId}`
      );
      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          stylist: result.data.stylist,
        };
      }
      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error deleting stylist:", error);
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

  getActiveStylists: async (seasonId, openBon, closedBon) => {
    try {
      const result = await apiClient.get(
        `/api/v1/stylist/active/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching active stylists:", error);
      return {
        status: "failed",
        message: "No response from server. Please try again later.",
      };
    }
  },

  createBonStylist: async (bonData) => {
    const { seasonId, stylistId } = bonData;
    try {
      const result = await apiClient.post(
        `/api/v1/stylist/bon/create/${seasonId}/${stylistId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating bon stylist:", error);
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

  createOrderStylist: async (orderData) => {
    const { seasonId, stylistId, ...rest } = orderData;
    try {
      const result = await apiClient.post(
        `/api/v1/stylist/order/create/${seasonId}/${stylistId}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating order stylist:", error);
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

  createAvanceStylist: async (avanceData) => {
    const { seasonId, stylistId, bonId, ...rest } = avanceData;
    try {
      const result = await apiClient.post(
        `/api/v1/stylist/avance/create/${seasonId}/${stylistId}/${bonId}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating avance stylist:", error);
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

  getOrdersStylist: async (seasonId, stylistId, bonId, queryParams) => {
    try {
      const result = await apiClient.get(
        `/api/v1/stylist/bon/details/${seasonId}/${stylistId}/${bonId}?page=${queryParams?.page}&limit=${queryParams?.limit}&search=${queryParams?.search}&date=${queryParams?.date}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching orders stylist:", error);
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

  updateOrderStylist: async (updateOrderStylistData) => {
    const { orderId, formData, seasonId } = updateOrderStylistData;
    try {
      const result = await apiClient.patch(
        `/api/v1/stylist/orders/update/${seasonId}/${orderId}`,
        formData
      );
      return result.data;
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

  deleteOrderStylist: async (orderId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/stylist/orders/delete/${seasonId}/${orderId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting order stylist:", error);
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

  deleteAvanceStylist: async (avanceId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/stylist/avances/delete/${seasonId}/${avanceId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting avance stylist:", error);
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

  toggleBonStylist: async (bonId, seasonId, openBon, closeBon) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/stylist/bon/${seasonId}/${bonId}?openBon=${openBon}&closeBon=${closeBon}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error toggling bon stylist:", error);
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

  deleteBonStylist: async (bonId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/stylist/bon/delete/${seasonId}/${bonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting bon stylist:", error);
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

  getStylistSummary: async (seasonId, stylistId, bonId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/stylist/bon/summary/${seasonId}/${stylistId}/${bonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching stylist summary:", error);
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
