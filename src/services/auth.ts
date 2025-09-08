import apiClient from "@/lib/apiClient";
import type { LoginUser, LogoutUser } from "@/types/types";

export const authService: {
  loginUser: LoginUser;
  logoutUser: LogoutUser;
} = {
  loginUser: async (userCredentials) => {
    try {
      const response = await apiClient.post("/api/v1/user/login", {
        email: userCredentials.email,
        password: userCredentials.password,
      });

      if (response.status === 200) {
        localStorage.setItem("auth_token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return {
          status: "success",
          message: response.data.message,
          user: response.data.user,
        };
      }
      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        return {
          status: "failed",
          message: data.message || data.errors,
        };
      }

      console.error("No response from server:", error.request);
      return {
        status: "failed",
        message: "No response from server. Please try again later.",
      };
    }
  },

  logoutUser: async () => {
    try {
      // Clear the local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      return {
        status: "success",
        message: "Logged out successfully.",
      };
    } catch (error) {
      console.error("Error during logout:", error);
      return {
        status: "failed",
        message: "Logout failed. Please try again.",
      };
    }
  },
};
