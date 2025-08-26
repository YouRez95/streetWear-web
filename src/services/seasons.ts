import apiClient from "@/lib/apiClient";
import type {
  GetSeasons,
  CreateSeason,
  UpdateSeason,
  DeleteSeason,
  ToggleSeason,
} from "@/types/types";

export const seasonsService: {
  fetchSeasons: GetSeasons;
  createSeason: CreateSeason;
  updateSeason: UpdateSeason;
  deleteSeason: DeleteSeason;
  toggleSeason: ToggleSeason;
} = {
  fetchSeasons: async (page, limit, search) => {
    try {
      const result = await apiClient.get(
        `/api/v1/season/all?page=${page}&limit=${limit}&search=${search}`
      );

      if (result.status === 200) {
        return result.data;
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
        seasons: [],
        currentPage: 0,
        totalPages: 0,
      };
    } catch (error: any) {
      console.error("Error fetching seasons:", error);
      const { status, data } = error.response || {};

      if (status === 400 && data?.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
          seasons: [],
          currentPage: 0,
          totalPages: 0,
        };
      }

      return {
        status: "failed",
        message:
          data?.message || "No response from server. Please try again later.",
        seasons: [],
        currentPage: 0,
        totalPages: 0,
      };
    }
  },

  createSeason: async (seasonData) => {
    try {
      const result = await apiClient.post("/api/v1/season/create", seasonData);

      if (result.status === 201) {
        return {
          status: "success",
          message: result.data.message,
          season: result.data.season,
        };
      }

      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error creating season:", error);
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

  updateSeason: async (seasonData) => {
    try {
      const { id: seasonId, ...restData } = seasonData;
      const result = await apiClient.put(
        `/api/v1/season/update/${seasonId}`,
        restData
      );

      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          season: result.data.season,
        };
      }

      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error updating season:", error);
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

  deleteSeason: async (seasonId) => {
    try {
      const result = await apiClient.delete(
        `/api/v1/season/delete/${seasonId}`
      );

      if (result.status === 200) {
        return { status: "success", message: result.data.message };
      }

      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error deleting season:", error);
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

  toggleSeason: async (seasonId) => {
    try {
      const result = await apiClient.put(`/api/v1/season/toggle/${seasonId}`);

      if (result.status === 200) {
        return {
          status: "success",
          message: result.data.message,
          season: result.data.season,
        };
      }

      return { status: "failed", message: "Unexpected response from server." };
    } catch (error: any) {
      console.error("Error toggling season:", error);
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
