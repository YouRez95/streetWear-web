import { userService } from "@/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export const queryKeys = {
  users: (page: number, limit: number, search: string) => [
    "users",
    page,
    limit,
    search,
  ],
  usersRoot: ["users"],
};

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || "Something went wrong",
    variant: "destructive",
  });
}

export function useUsers(page: number, limit: number, search = "") {
  return useQuery({
    queryKey: queryKeys.users(page, limit, search),
    queryFn: () => userService.fetchUsers(page, limit, search),
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating user",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User created successfully",
        description: "User has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating user", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoot,
        exact: false,
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting user",
          description: data.message || "Failed to delete user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User deleted",
        description: data.message || "User has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting user", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating user",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User updated successfully",
        description: data.message || "User has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating user", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoot,
        exact: false,
      });
    },
  });
}
