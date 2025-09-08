// apiClient.ts
import axios, { AxiosError } from "axios";
import { SERVER_URL } from "./env";
import { useUserStore } from "@/store/userStore";

// Example: replace with your token storage logic
const getToken = async (): Promise<string | null> => {
  return localStorage.getItem("auth_token");
};

const apiClient = axios.create({
  baseURL: SERVER_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token on each request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const errorCode = error.response?.data?.errorCode;

    if (errorCode === 700 || errorCode === 701) {
      // Example: logout
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      const { setLogout } = useUserStore.getState();
      setLogout();
      if ((window as any).queryClient) {
        (window as any).queryClient.clear();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
