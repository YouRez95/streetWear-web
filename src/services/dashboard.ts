import apiClient from "@/lib/apiClient";
import type {
  GetGeneralSettings,
  GetRetardOrdersFaconnier,
  GetSummary,
} from "@/types/types";

export const dashboardService: {
  getGeneralSettings: GetGeneralSettings;
  getSummary: GetSummary;
  getRetardOrdersFaconnier: GetRetardOrdersFaconnier;
} = {
  getGeneralSettings: async () => {
    try {
      const result = await apiClient.get("/api/v1/dashboard/settings/general");

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error fetching general settings:", error);
      const { data } = error.response || {};
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },

  getSummary: async (seasonId: string) => {
    try {
      const result = await apiClient.get(
        `/api/v1/dashboard/summary/${seasonId}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error fetching summary:", error);
      const { data } = error.response || {};
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },

  getRetardOrdersFaconnier: async (seasonId: string) => {
    try {
      const result = await apiClient.get(
        `/api/v1/dashboard/faconniers-retard/${seasonId}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error fetching retard orders façonnier:", error);
      const { data } = error.response || {};
      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
      };
    }
  },
};
