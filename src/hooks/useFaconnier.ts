import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { queryKeys as queryKeysDashboard } from "./useDashboard";
import { queryKeys as queryKeysProducts } from "./useProduct";
import { faconnierService } from "@/services/faconnier";
import type {
  CreateAvanceFaconnierInput,
  CreateOrderFaconnierInput,
  GetActiveFaconniersResponse,
  QueryParams,
  UpdateOrderFaconnierInput,
} from "@/types/models";
import { useUserStore } from "@/store/userStore";

export const queryKeys = {
  faconniers: (page: number, limit: number, search: string) => [
    "faconniers",
    page,
    limit,
    search,
  ],
  faconniersRoot: ["faconniers"],
  activeFaconniers: (seasonId: string) => ["activeFaconniers", seasonId],
  ordersFaconnier: (
    seasonId: string,
    faconnierId: string,
    bonId: string,
    queryParams: QueryParams
  ) => ["ordersFaconnier", seasonId, faconnierId, bonId, queryParams],
  faconnierSummary: (seasonId: string, faconnierId: string, bonId: string) => [
    "faconnierSummary",
    seasonId,
    faconnierId,
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

export function useFaconniers(page: number, limit: number, search = "") {
  return useQuery({
    queryKey: queryKeys.faconniers(page, limit, search),
    queryFn: () => faconnierService.fetchFaconniers(page, limit, search),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCreateOrderFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (orderData: Omit<CreateOrderFaconnierInput, "seasonId">) =>
      faconnierService.createOrderFaconnier({
        seasonId,
        ...orderData,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating order faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order faconnier created successfully",
        description:
          data.message || "Order faconnier has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating order faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: ["ordersFaconnier", seasonId, variables.faconnierId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconnierSummary(
          seasonId,
          variables.faconnierId,
          ""
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

export function useCreateBonFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (faconnierId: string) =>
      faconnierService.createBonFaconnier({
        seasonId,
        faconnierId,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating bon faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon faconnier created successfully",
        description:
          data.message || "Bon faconnier has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating bon faconnier", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeFaconniers(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteBonFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (bonId: string) =>
      faconnierService.deleteBonFaconnier(bonId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting bon faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon faconnier deleted successfully",
        description:
          data.message || "Bon faconnier has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting bon faconnier", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeFaconniers(seasonId),
        exact: false,
      });
    },
  });
}

export function useActiveFaconniers(
  openBon: boolean = true,
  closedBon: boolean = false
) {
  const { activeSeason } = useUserStore();
  return useQuery({
    queryKey: [
      ...queryKeys.activeFaconniers(activeSeason?.id || ""),
      openBon,
      closedBon,
    ],
    queryFn: () => {
      if (!activeSeason) {
        return Promise.resolve<GetActiveFaconniersResponse>({
          status: "failed",
          message: "No active season",
          faconniers: [],
        });
      }
      return faconnierService.getActiveFaconniers(
        activeSeason.id,
        openBon,
        closedBon
      );
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useOrdersFaconnier(
  faconnierId: string,
  bonId: string,
  queryParams: QueryParams
) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  // Always call useQuery, but disable it if faconnierId or bonId is empty
  return useQuery({
    queryKey: queryKeys.ordersFaconnier(
      seasonId,
      faconnierId,
      bonId,
      queryParams
    ),
    queryFn: () =>
      faconnierService.getOrdersFaconnier(
        seasonId,
        faconnierId,
        bonId,
        queryParams
      ),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: faconnierId !== "" && bonId !== "", // Only run if both are set
  });
}

export function useCreateAvanceFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (avanceData: Omit<CreateAvanceFaconnierInput, "seasonId">) =>
      faconnierService.createAvanceFaconnier({ seasonId, ...avanceData }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating avance faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Avance faconnier created successfully",
        description:
          data.message || "Avance faconnier has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) =>
      showErrorToast("Error creating avance faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersFaconnier(
          seasonId,
          variables.faconnierId || "",
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconnierSummary(
          seasonId,
          variables.faconnierId || "",
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

export function useUpdateOrderFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      orderId,
      formData,
      faconnierId,
      bonId,
    }: Omit<UpdateOrderFaconnierInput, "seasonId">) =>
      faconnierService.updateOrderFaconnier({
        bonId,
        faconnierId,
        orderId,
        formData,
        seasonId,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating order faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order faconnier updated successfully",
        description:
          data.message || "Order faconnier has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating order faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersFaconnier(
          seasonId,
          variables.faconnierId,
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconnierSummary(
          seasonId,
          variables.faconnierId,
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

export function useFaconnierSummary(faconnierId: string, bonId: string) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.faconnierSummary(seasonId, faconnierId, bonId),
    queryFn: () =>
      faconnierService.getFaconnierSummary(seasonId, faconnierId, bonId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: faconnierId !== "" && bonId !== "",
  });
}

export function useCreateFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: faconnierService.createFaconnier,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Faconnier created successfully",
        description: data.message || "Faconnier has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating Faconniers", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconniersRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeFaconniers(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteFaconnier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: faconnierService.deleteFaconnier,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Faconnier deleted successfully",
        description: data.message || "Faconnier has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting Faconniers", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconniersRoot,
        exact: false,
      });
    },
  });
}

export function useDeleteAvanceFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      avanceId,
      faconnierId: _faconnierId,
      bonId: _bonId,
    }: {
      avanceId: string;
      faconnierId: string;
      bonId: string;
    }) => faconnierService.deleteAvanceFaconnier(avanceId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting avance faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Avance faconnier deleted successfully",
        description:
          data.message || "Avance faconnier has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) =>
      showErrorToast("Error deleting avance faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersFaconnier(
          seasonId,
          variables.faconnierId,
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconnierSummary(
          seasonId,
          variables.faconnierId,
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

export function useDeleteOrderFaconnier() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      orderId,
      faconnierId: _faconnierId,
      bonId: _bonId,
    }: {
      orderId: string;
      faconnierId: string;
      bonId: string;
    }) => faconnierService.deleteOrderFaconnier(orderId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting order faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order faconnier deleted successfully",
        description:
          data.message || "Order faconnier has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting order faconnier", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersFaconnier(
          seasonId,
          variables.faconnierId,
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

export function useUpdateFaconnier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: faconnierService.updateFaconnier,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Faconnier updated successfully",
        description: data.message || "Faconnier has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Faconniers", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconniersRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateFaconnierStatus() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: faconnierService.updateFaconnierStatus,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating faconnier status",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Faconnier status updated successfully",
        description:
          data.message || "Faconnier status has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Faconniers", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.faconniersRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeFaconniers(seasonId),
        exact: false,
      });
    },
  });
}

export function useToggleBonFaconnier() {
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
    }) =>
      faconnierService.toggleBonFaconnier(bonId, seasonId, openBon, closeBon),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error opening/closing bon faconnier",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon faconnier toggled successfully",
        description:
          data.message || "Bon faconnier has been opened/closed successfully.",
        variant: "default",
      });
    },
    onError: (error) =>
      showErrorToast("Error opening/closing bon faconnier", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeFaconniers(seasonId),
        exact: false,
      });
    },
  });
}
