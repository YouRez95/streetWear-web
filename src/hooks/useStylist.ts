import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { queryKeys as queryKeysDashboard } from "./useDashboard";
import { queryKeys as queryKeysProducts } from "./useProduct";
import type {
  CreateAvanceStylistInput,
  CreateOrderStylistInput,
  GetActiveStylistsResponse,
  QueryParams,
  UpdateOrderStylistInput,
} from "@/types/models";
import { stylistService } from "@/services/stylist";
import { useUserStore } from "@/store/userStore";
export const queryKeys = {
  stylistsRoot: ["stylists"],
  stylists: (types: string[], page: number, limit: number, search: string) => [
    "stylists",
    types,
    page,
    limit,
    search,
  ],
  activeStylists: (seasonId: string) => ["activeStylists", seasonId],
  ordersStylist: (
    seasonId: string,
    stylistId: string,
    bonId: string,
    queryParams: QueryParams
  ) => ["ordersStylist", seasonId, stylistId, bonId, queryParams],
  stylistSummary: (seasonId: string, stylistId: string, bonId: string) => [
    "stylistSummary",
    seasonId,
    stylistId,
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

export function useStylists(
  types: string[],
  page: number,
  limit: number,
  search = ""
) {
  return useQuery({
    queryKey: queryKeys.stylists(types, page, limit, search),
    queryFn: () => stylistService.getStylists(types, page, limit, search),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCreateStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: stylistService.createStylist,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Stylist created successfully",
        description: data.message || "Stylist has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating Stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistsRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}

export function useUpdateStylistStatus() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: stylistService.updateStylistStatus,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating stylist status",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Stylist status updated successfully",
        description:
          data.message || "Stylist status has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistsRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}

export function useUpdateStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: stylistService.updateStylist,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Stylist updated successfully",
        description: data.message || "Stylist has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistsRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: stylistService.deleteStylist,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Stylist deleted successfully",
        description: data.message || "Stylist has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting Stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistsRoot,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}

export function useActiveStylists(
  openBon: boolean = true,
  closedBon: boolean = false
) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";
  return useQuery({
    queryKey: [...queryKeys.activeStylists(seasonId), openBon, closedBon],
    queryFn: () => {
      if (!seasonId) {
        return Promise.resolve<GetActiveStylistsResponse>({
          status: "failed",
          message: "No active season",
          stylists: [],
        });
      }
      return stylistService.getActiveStylists(seasonId, openBon, closedBon);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCreateBonStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (stylistId: string) =>
      stylistService.createBonStylist({
        seasonId,
        stylistId,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating bon stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon stylist created successfully",
        description:
          data.message || "Bon stylist has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating bon stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}

export function useCreateOrderStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (orderData: Omit<CreateOrderStylistInput, "seasonId">) =>
      stylistService.createOrderStylist({
        seasonId,
        ...orderData,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating order stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order stylist created successfully",
        description:
          data.message || "Order stylist has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating order stylist", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersStylist(
          seasonId,
          variables.stylistId,
          "",
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistSummary(seasonId, variables.stylistId, ""),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
    },
  });
}

export function useCreateAvanceStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (avanceData: Omit<CreateAvanceStylistInput, "seasonId">) =>
      stylistService.createAvanceStylist({ seasonId, ...avanceData }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating avance stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Avance stylist created successfully",
        description:
          data.message || "Avance stylist has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating avance stylist", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersStylist(
          seasonId,
          variables.stylistId || "",
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistSummary(
          seasonId,
          variables.stylistId || "",
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

export function useOrdersStylist(
  stylistId: string,
  bonId: string,
  queryParams: QueryParams
) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  // Always call useQuery, but disable it if faconnierId or bonId is empty
  return useQuery({
    queryKey: queryKeys.ordersStylist(seasonId, stylistId, bonId, queryParams),
    queryFn: () =>
      stylistService.getOrdersStylist(seasonId, stylistId, bonId, queryParams),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: stylistId !== "" && bonId !== "", // Only run if both are set
  });
}

export function useUpdateOrderStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      orderId,
      formData,
      stylistId,
      bonId,
    }: Omit<UpdateOrderStylistInput, "seasonId">) =>
      stylistService.updateOrderStylist({
        bonId,
        stylistId,
        orderId,
        formData,
        seasonId,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating order stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order stylist updated successfully",
        description:
          data.message || "Order stylist has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating order stylist", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersStylist(
          seasonId,
          variables.stylistId,
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistSummary(
          seasonId,
          variables.stylistId,
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

export function useDeleteOrderStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      orderId,
      stylistId: _stylistId,
      bonId: _bonId,
    }: {
      orderId: string;
      stylistId: string;
      bonId: string;
    }) => stylistService.deleteOrderStylist(orderId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting order stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Order stylist deleted successfully",
        description:
          data.message || "Order stylist has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting order stylist", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersStylist(
          seasonId,
          variables.stylistId,
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

export function useDeleteAvanceStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      avanceId,
      stylistId: _stylistId,
      bonId: _bonId,
    }: {
      avanceId: string;
      stylistId: string;
      bonId: string;
    }) => stylistService.deleteAvanceStylist(avanceId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting avance stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Avance stylist deleted successfully",
        description:
          data.message || "Avance stylist has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting avance stylist", error),
    onSettled: (_data, _error, variables) => {
      if (!variables) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.ordersStylist(
          seasonId,
          variables.stylistId,
          variables.bonId,
          {}
        ),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stylistSummary(
          seasonId,
          variables.stylistId,
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

export function useStylistSummary(stylistId: string, bonId: string) {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.stylistSummary(seasonId, stylistId, bonId),
    queryFn: () => stylistService.getStylistSummary(seasonId, stylistId, bonId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: stylistId !== "" && bonId !== "",
  });
}

export function useToggleBonStylist() {
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
    }) => stylistService.toggleBonStylist(bonId, seasonId, openBon, closeBon),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error opening/closing bon stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon stylist toggled successfully",
        description:
          data.message || "Bon stylist has been opened/closed successfully.",
        variant: "default",
      });
    },
    onError: (error) =>
      showErrorToast("Error opening/closing bon stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}

export function useDeleteBonStylist() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (bonId: string) =>
      stylistService.deleteBonStylist(bonId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting bon stylist",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Bon stylist deleted successfully",
        description:
          data.message || "Bon stylist has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting bon stylist", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activeStylists(seasonId),
        exact: false,
      });
    },
  });
}
