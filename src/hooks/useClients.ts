import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { queryKeys as queryKeysDashboard } from "./useDashboard";
import { queryKeys as queryKeysProducts } from "./useProduct";
import type {
  CreateAvanceClientInput,
  CreateMultipleOrdersClientInput,
  CreateOrderClientInput,
  GetActiveClientsResponse,
  QueryParams,
  UpdateOrderClientInput,
} from "@/types/models";
import { clientService } from "@/services/client";
import { useUserStore } from "@/store/userStore";
import { queryKeys as queryKeysStockReturn } from "./useReturnStock";

export const queryKeys = {
  clients: (page: number, limit: number, search: string) => [
    "clients",
    page,
    limit,
    search,
  ],
  clientsRoot: ["clients"],
  activeClients: (seasonId: string) => ["activeClients", seasonId],
  ordersClient: (
    seasonId: string,
    clientId: string,
    bonId: string,
    queryParams?: QueryParams
  ) => ["ordersClient", seasonId, clientId, bonId, queryParams],
  clientSummary: (seasonId: string, clientId: string, bonId: string) => [
    "clientSummary",
    seasonId,
    clientId,
    bonId,
  ],
};

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || "Something went wrong",
    variant: "destructive",
  });
}

export function useClients(page: number, limit: number, search = "") {
  return useQuery({
    queryKey: queryKeys.clients(page, limit, search),
    queryFn: () => clientService.fetchClients(page, limit, search),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Client created successfully",
        description: data.message || "Client has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating Client", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientsRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeClients(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Client deleted successfully",
        description: data.message || "Client has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting Client", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientsRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.updateClient,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Client updated successfully",
        description: data.message || "Client has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Client", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientsRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.updateClientStatus,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating client status",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Client status updated successfully",
        description:
          data.message || "Client status has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Client status", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientsRoot,
        exact: false,
      });
    },
  });
}

export function useActiveClients(
  openBon: boolean = true,
  closedBon: boolean = false
) {
  const { activeSeason } = useUserStore();
  return useQuery({
    queryKey: [
      ...queryKeys.activeClients(activeSeason?.id || ""),
      openBon,
      closedBon,
    ],
    queryFn: () => {
      if (!activeSeason) {
        return Promise.resolve<GetActiveClientsResponse>({
          status: "failed",
          message: "No active season",
          clients: [],
        });
      }
      return clientService.getActiveClients(
        activeSeason.id,
        openBon,
        closedBon
      );
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useOrdersClient(
  clientId: string,
  bonId: string,
  queryParams: QueryParams
) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  // Always call useQuery, but disable it if faconnierId or bonId is empty
  return useQuery({
    queryKey: queryKeys.ordersClient(seasonId, clientId, bonId, queryParams),
    queryFn: () =>
      clientService.getOrdersClient(seasonId, clientId, bonId, queryParams),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: clientId !== "" && bonId !== "", // Only run if both are set
  });
}

export function useCreateBonClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (clientId: string) =>
      clientService.createBonClient({
        seasonId,
        clientId,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating bon client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon client created successfully",
        description:
          data.message || "Bon client has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating bon faconnier", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeClients(seasonId),
        exact: false,
      });
    },
  });
}

export function useCreateOrderClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (orderData: Omit<CreateOrderClientInput, "seasonId">) =>
      clientService.createOrderClient({
        seasonId,
        ...orderData,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating order client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order client created successfully",
        description:
          data.message || "Order client has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating order client", error),
    onSettled: (data, _error, variables) => {
      if (!variables || !data?.order) return;
      queryClient.invalidateQueries({
        queryKey: [
          "ordersClient",
          seasonId,
          variables.clientId,
          data?.order?.bon_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientSummary(seasonId, variables.clientId, ""),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
    },
  });
}

export function useCreateMultipleOrdersClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (orderData: CreateMultipleOrdersClientInput) =>
      clientService.createMultipleOrdersClient({
        seasonId,
        ...orderData,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating order client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order client created successfully",
        description:
          data.message || "Order client has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating order client", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersClient(seasonId, variables.clientId, "", {}),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientSummary(seasonId, variables.clientId, ""),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
    },
  });
}

export function useClientSummary(clientId: string, bonId: string) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.clientSummary(seasonId, clientId, bonId),
    queryFn: () => clientService.getClientSummary(seasonId, clientId, bonId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: clientId !== "" && bonId !== "", // Only run if both are set
  });
}

export function useCreateAvanceClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (avanceData: Omit<CreateAvanceClientInput, "seasonId">) =>
      clientService.createAvanceClient({ seasonId, ...avanceData }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating avance client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Avance client created successfully",
        description:
          data.message || "Avance client has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating avance client", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersClient(
          seasonId,
          variables.clientId || "",
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientSummary(
          seasonId,
          variables.clientId || "",
          variables.bonId
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysDashboard.summary(seasonId),
      });
    },
  });
}

export function useToggleBonClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      bonId,
      openBon,
      closeBon,
    }: {
      bonId: string;
      openBon: boolean;
      closeBon: boolean;
    }) => clientService.toggleBonClient(bonId, seasonId, openBon, closeBon),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error opening/closing bon client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon client toggled successfully",
        description:
          data.message || "Bon client has been opened/closed successfully.",
        variant: "default",
      });
    },
    onError: (error) =>
      showErrorToast("Error opening/closing bon client", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeClients(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteBonClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (bonId: string) =>
      clientService.deleteBonClient(bonId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting bon client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon client deleted successfully",
        description:
          data.message || "Bon client has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting bon client", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeClients(seasonId),
        exact: false,
      });
    },
  });
}

export function useUpdateOrderClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      orderId,
      formData,
      clientId,
      bonId,
    }: Omit<UpdateOrderClientInput, "seasonId">) =>
      clientService.updateOrderClient({
        bonId,
        clientId,
        orderId,
        formData,
        seasonId,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating order client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order client updated successfully",
        description:
          data.message || "Order client has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating order faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersClient(
          seasonId,
          variables.clientId,
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientSummary(
          seasonId,
          variables.clientId,
          variables.bonId
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysStockReturn.returnStockRoot(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteOrderClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      orderId,
      clientId: _clientId,
      bonId: _bonId,
    }: {
      orderId: string;
      clientId: string;
      bonId: string;
    }) => clientService.deleteOrderClient(orderId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting order client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order client deleted successfully",
        description:
          data.message || "Order client has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting order client", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersClient(
          seasonId,
          variables.clientId,
          variables.bonId,
          {}
        ),
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteAvanceClient() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      avanceId,
      clientId: _clientId,
      bonId: _bonId,
    }: {
      avanceId: string;
      clientId: string;
      bonId: string;
    }) => clientService.deleteAvanceClient(avanceId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting avance client",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Avance client deleted successfully",
        description:
          data.message || "Avance client has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) =>
      showErrorToast("Error deleting avance faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersClient(
          seasonId,
          variables.clientId,
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientSummary(
          seasonId,
          variables.clientId,
          variables.bonId
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
    },
  });
}
