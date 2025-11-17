import apiClient from "@/lib/apiClient";
import type {
  GetClients,
  CreateClient,
  UpdateClient,
  UpdateClientStatus,
  DeleteClient,
  GetActiveClients,
  CreateBonClient,
  CreateOrderClient,
  CreateMultipleOrdersClient,
  GetOrdersClient,
  CreateAvanceClient,
  GetClientSummary,
  DeleteBonClient,
  DeleteOrderClient,
  DeleteAvanceClient,
  ToggleBonClient,
  UpdateOrderClient,
  CreateBonClientPassager,
  GetBonsClientPassager,
} from "@/types/types";

export const clientService: {
  fetchClients: GetClients;
  createClient: CreateClient;
  updateClient: UpdateClient;
  updateClientStatus: UpdateClientStatus;
  deleteClient: DeleteClient;
  getActiveClients: GetActiveClients;
  createBonClient: CreateBonClient;
  createOrderClient: CreateOrderClient;
  createMultipleOrdersClient: CreateMultipleOrdersClient;
  getOrdersClient: GetOrdersClient;
  createAvanceClient: CreateAvanceClient;
  getClientSummary: GetClientSummary;
  deleteBonClient: DeleteBonClient;
  deleteOrderClient: DeleteOrderClient;
  deleteAvanceClient: DeleteAvanceClient;
  toggleBonClient: ToggleBonClient;
  updateOrderClient: UpdateOrderClient;
  createBonClientPassager: CreateBonClientPassager;
  getBonsClientPassager: GetBonsClientPassager;
  getActiveClientsAndPassager: GetActiveClients;
} = {
  fetchClients: async (page, limit, search) => {
    try {
      const result = await apiClient.get(
        `/api/v1/client/all?page=${page}&limit=${limit}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching clients:", error);
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

  createClient: async (clientData) => {
    try {
      const result = await apiClient.post("/api/v1/client/create", clientData);
      if (result.status === 201) {
        return {
          status: "success",
          message: result.data.message,
          client: result.data.client,
        };
      }
      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error creating client:", error);
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

  updateClient: async (clientData) => {
    const { id, ...rest } = clientData;
    try {
      const result = await apiClient.put(`/api/v1/client/update/${id}`, rest);
      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          client: result.data.client,
        };
      }
      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error updating client:", error);
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

  updateClientStatus: async ({ clientId, status }) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/client/status/${clientId}`,
        { status }
      );
      return result.data;
    } catch (error: any) {
      console.error("Error updating client status:", error);
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

  deleteClient: async (clientId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/client/delete/${clientId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting client:", error);
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

  getActiveClients: async (seasonId, openBon, closedBon) => {
    try {
      const result = await apiClient.get(
        `/api/v1/client/active/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching active clients:", error);
      return {
        status: "failed",
        message: "No response from server. Please try again later.",
      };
    }
  },

  createBonClient: async (bonData) => {
    const { seasonId, clientId } = bonData;
    try {
      const result = await apiClient.post(
        `/api/v1/client/bon/create/${seasonId}/${clientId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating bon client:", error);
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

  createOrderClient: async (orderData) => {
    const { seasonId, clientId, ...rest } = orderData;
    const endpoint = `/api/v1/client/order/create/${seasonId}/${
      clientId ?? "passager"
    }`;
    try {
      const result = await apiClient.post(endpoint, rest);
      return result.data;
    } catch (error: any) {
      console.error("Error creating order client:", error);
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

  createMultipleOrdersClient: async (ordersData) => {
    const { seasonId, clientId, ...rest } = ordersData;
    try {
      const result = await apiClient.post(
        `/api/v1/client/orders/create/${seasonId}/${clientId}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating multiple orders client:", error);
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

  getOrdersClient: async (seasonId, clientId, bonId, queryParams) => {
    try {
      const result = await apiClient.get(
        `/api/v1/client/bon/details/${seasonId}/${clientId}/${bonId}?page=${queryParams?.page}&limit=${queryParams?.limit}&search=${queryParams?.search}&date=${queryParams?.date}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching orders client:", error);
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

  createAvanceClient: async (avanceData) => {
    const { seasonId, clientId, bonId, ...rest } = avanceData;
    try {
      const result = await apiClient.post(
        `/api/v1/client/avance/create/${seasonId}/${clientId}/${bonId}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating avance client:", error);
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

  getClientSummary: async (seasonId, clientId, bonId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/client/bon/summary/${seasonId}/${clientId}/${bonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching client summary:", error);
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

  deleteBonClient: async (bonId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/client/bon/delete/${seasonId}/${bonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting bon client:", error);
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

  deleteOrderClient: async (orderId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/client/orders/delete/${seasonId}/${orderId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting order client:", error);
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

  deleteAvanceClient: async (avanceId, seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/client/avances/delete/${seasonId}/${avanceId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error deleting avance client:", error);
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

  toggleBonClient: async (toggleData) => {
    const { bonId, closeBon, openBon, seasonId, remise } = toggleData;

    try {
      const result = await apiClient.patch(
        `/api/v1/client/bon/${seasonId}/${bonId}?openBon=${openBon}&closeBon=${closeBon}`,
        { remise: remise ? remise : 0 }
      );
      //console.log('Open bon client result:', result)
      return result.data;
    } catch (error: any) {
      console.error("Error opening bon client:", error);
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

  updateOrderClient: async (updateOrderClientData) => {
    const { orderId, formData, seasonId } = updateOrderClientData;
    try {
      const result = await apiClient.patch(
        `/api/v1/client/orders/update/${seasonId}/${orderId}`,
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

  createBonClientPassager: async (bonData) => {
    try {
      const { seasonId } = bonData;
      const result = await apiClient.post(
        `/api/v1/client/bon/create/passager/${seasonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating bon client:", error);
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

  getBonsClientPassager: async (seasonId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/client/bon/passager/${seasonId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error get bon client passager:", error);
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

  getActiveClientsAndPassager: async (
    seasonId,
    openBon = true,
    closedBon = false
  ) => {
    try {
      const result = await apiClient.get(
        `/api/v1/client/active/passager/${seasonId}?openBon=${openBon}&closedBon=${closedBon}`
      );
      //console.log('Get active clients result:', result)
      return result.data;
    } catch (error: any) {
      console.error("Error fetching active clients:", error);
      return {
        status: "failed",
        message: "No response from server. Please try again later.",
      };
    }
  },
};
