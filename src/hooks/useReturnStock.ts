import { returnStockService } from "@/services/returnStock";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { queryKeys as queryKeysProducts } from "./useProduct";
import type { CreateOrderClientInput } from "@/types/models";

export const queryKeys = {
  returnStock: (
    page: number,
    limit: number,
    search: string,
    seasonId: string
  ) => ["stock-return", seasonId, page, limit, search],
  returnStockRoot: (seasonId: string) => ["stock-return", seasonId],
  returnStockSummary: (seasonId: string) => ["stock-return-summary", seasonId],
};

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || "Something went wrong",
    variant: "destructive",
  });
}

export function useReturnStock(page: number, limit: number, search = "") {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.returnStock(page, limit, search, seasonId),
    queryFn: () =>
      returnStockService.fetchReturnStock({
        page,
        limit,
        search,
        seasonId: seasonId,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!activeSeason,
  });
}

export function useDeleteClientReturnStock() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (clientReturnId: string) =>
      returnStockService.deleteClientReturnStock(clientReturnId, seasonId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting return stock",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Return stock deleted",
        description: data.message || "Return stock deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting return stock", error),
    onSettled: (data) => {
      if (!data?.data) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.returnStockRoot(seasonId),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [
          "ordersClient",
          seasonId,
          data?.data.clientId,
          data?.data.bonId,
        ],
      });
    },
  });
}

export function useUpdateClientReturnStock() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: ({
      clientReturnId,
      newQuantity,
    }: {
      clientReturnId: string;
      newQuantity: number;
    }) =>
      returnStockService.updateClientReturnStock({
        seasonId,
        clientReturnId,
        newQuantity,
      }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating return stock",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Return stock updated",
        description: data.message || "Return stock updated successfully",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating return stock", error),
    onSettled: (data) => {
      console.log("onSettled data update", data);
      if (data?.status === "failed" || !data?.data) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.returnStockRoot(seasonId),
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [
          "ordersClient",
          seasonId,
          data?.data.clientId,
          data?.data.bonId,
        ],
      });
    },
  });
}

export function useGetSummaryReturnStock() {
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.returnStockSummary(seasonId),
    queryFn: () => returnStockService.getSummaryReturnStock(seasonId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!activeSeason,
  });
}

export function useCreateOrderClientFromReturnStock() {
  const queryClient = useQueryClient();
  const { activeSeason } = useUserStore();
  const seasonId = activeSeason?.id || "";

  return useMutation({
    mutationFn: (orderData: Omit<CreateOrderClientInput, "seasonId">) =>
      returnStockService.createOrderClientFromReturnStock({
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
        queryKey: queryKeys.returnStockRoot(seasonId),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [
          "ordersClient",
          seasonId,
          _data?.data?.clientId,
          _data?.data?.bonId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "clientSummary",
          seasonId,
          _data?.data?.clientId,
          ,
          _data?.data?.bonId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeysProducts.productsRoot(seasonId),
        exact: false,
      });
    },
  });
}
