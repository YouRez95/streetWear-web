import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import type {
  CreateProductInput,
  GetProductsResponse,
  UpdateProductInput,
} from "@/types/models";
import { productService } from "@/services/product";
import { useEffect } from "react";

export const queryKeys = {
  products: (page: number, limit: number, search: string, seasonId: string) => [
    "products",
    seasonId,
    page,
    limit,
    search,
  ],
  productsRoot: (seasonId: string) => ["products", seasonId],
  productsStatus: (seasonId: string) => ["productsStatus", seasonId],
};

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || "Something went wrong",
    variant: "destructive",
  });
}

export function useProducts(page: number, limit: number, search = "") {
  const { activeSeason } = useUserStore();

  const result = useQuery({
    queryKey: queryKeys.products(page, limit, search, activeSeason?.id || ""),
    queryFn: () => {
      if (!activeSeason) {
        // Return a properly typed error response
        return Promise.resolve<GetProductsResponse>({
          status: "failed",
          message: "No active season",
          products: [],
          currentPage: 1,
          totalPages: 1,
        });
      }
      return productService.fetchProducts({
        page,
        limit,
        search,
        seasonId: activeSeason.id,
      });
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (!activeSeason) {
      showErrorToast("Choose one of your Seasons or create one.", "");
    }
  }, [activeSeason]);

  return result;
}

export function useGetAllProductsStatus() {
  const { activeSeason } = useUserStore();

  return useQuery({
    queryKey: queryKeys.productsStatus(activeSeason?.id || ""),
    queryFn: () => productService.getAllProductsStatus(activeSeason?.id || ""),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!activeSeason,
    // initialData: {
    //   status: 'failed',
    //   message: 'No active season',
    //   totalProducts: 0,
    //   totalStatusResult: {
    //     raw_in_stock: 0,
    //     quantity_at_faconnier: 0,
    //     quantity_ready: 0,
    //     quantity_with_client: 0,
    //     quantity_returned_client: 0
    //   }
    // }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  const { activeSeason } = useUserStore();

  return useMutation({
    mutationFn: ({ productData }: { productData: CreateProductInput }) =>
      productService.createProduct(productData, activeSeason?.id || ""),
    onSuccess: (data) => {
      if (data.status === "failed") {
        showErrorToast("Error creating product", data);
        return;
      }

      toast({
        title: "Product created successfully",
        description: data.message || "Product has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating product", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productsRoot(activeSeason?.id || ""),
        exact: false,
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const { activeSeason } = useUserStore();
  if (!activeSeason) {
    showErrorToast("Choose one of your Seasons or create one.", "");
    return;
  }

  return useMutation({
    mutationFn: ({ productData }: { productData: UpdateProductInput }) =>
      productService.updateProduct(productData, activeSeason.id),
    onSuccess: (data) => {
      if (data.status === "failed") {
        showErrorToast("Error updating product", data);
        return;
      }

      toast({
        title: "Product updated successfully",
        description: data.message || "Product has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating product", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productsRoot(activeSeason?.id || ""),
        exact: false,
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { activeSeason } = useUserStore();
  if (!activeSeason) {
    showErrorToast("Choose one of your Seasons or create one.", "");
    return;
  }

  return useMutation({
    mutationFn: (productId: string) =>
      productService.deleteProduct(productId, activeSeason.id),
    onSuccess: (data) => {
      if (data.status === "failed") {
        showErrorToast("Error deleting product", data);
        return;
      }

      toast({
        title: "Product deleted successfully",
        description: data.message || "Product has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting product", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productsRoot(activeSeason?.id || ""),
        exact: false,
      });
    },
  });
}
