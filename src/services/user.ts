import type {
  CreateUser,
  DeleteUser,
  GetUsers,
  UpdateUser,
} from "@/types/types";
import apiClient from "@/lib/apiClient";
import { getMimeTypeFromFileName } from "@/lib/utils";

export const userService: {
  fetchUsers: GetUsers;
  createUser: CreateUser;
  deleteUser: DeleteUser;
  updateUser: UpdateUser;
} = {
  fetchUsers: async (page, limit, search) => {
    try {
      const result = await apiClient.get(
        `/api/v1/user/all?page=${page}&limit=${limit}&search=${search}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error fetching users:", error);
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

  createUser: async (userData) => {
    try {
      const formData = new FormData();
      const fields = ["name", "email", "role", "password", "phone", "address"];

      for (const key of fields) {
        formData.append(key, (userData as any)[key] || "");
      }

      if (userData.image) {
        const mimeType = getMimeTypeFromFileName(userData.fileName || "");
        const blob = new Blob([userData.image], { type: mimeType });
        formData.append("profileImage", blob, userData.fileName || "image.png");
      }

      const result = await apiClient.post("/api/v1/user/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (result.status === 201) {
        return {
          status: "success",
          message: result.data.message,
          user: result.data.user,
        };
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error creating user:", error);
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

  deleteUser: async (userId) => {
    try {
      const result = await apiClient.delete(`/api/v1/user/delete/${userId}`);

      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
        };
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error deleting user:", error);
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

  updateUser: async (userData) => {
    try {
      const formData = new FormData();
      const fields = ["name", "email", "role", "password", "phone", "address"];

      for (const key of fields) {
        if (key === "password" && !userData.password) continue;
        formData.append(key, (userData as any)[key] || "");
      }

      if (userData.image) {
        const mimeType = getMimeTypeFromFileName(userData.fileName || "");
        const blob = new Blob([userData.image], { type: mimeType });
        formData.append("profileImage", blob, userData.fileName || "image.png");
      }

      const result = await apiClient.put(
        `/api/v1/user/update/${userData.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          user: result.data.user,
        };
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
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
