import apiClient from "@/lib/apiClient";
import type {
  GetWorkPlaces,
  CreateWorkPlace,
  UpdateWorkplace,
  DeleteWorkplace,
  GetWorkers,
  CreateWorker,
  UpdateWorker,
  DeleteWorker,
  UpdateWorkerStatus,
  GetWeeksByCursor,
  CreateWeek,
  GetSummaryWorkers,
  GetWorkerRecords,
  GetWorkPlacesByCursor,
  GetWorkersByCursor,
  GetSummaryWorker,
  GetYearByCursor,
  GetYearSummary,
  CreateWeekRecord,
  DeleteWeekRecord,
  UpdateWeekRecordPayment,
  UpdateWeekRecord,
  GetWeekRecords,
  DeleteWeek,
  UpdateWeek,
} from "@/types/types";

export const workersService: {
  createWorkPlace: CreateWorkPlace;
  getWorkPlaces: GetWorkPlaces;
  getWorkPlacesByCursor: GetWorkPlacesByCursor;
  updateWorkPlace: UpdateWorkplace;
  deleteWorkPlace: DeleteWorkplace;
  createWorker: CreateWorker;
  getWorkers: GetWorkers;
  updateWorker: UpdateWorker;
  deleteWorker: DeleteWorker;
  getWorkersByCursor: GetWorkersByCursor;
  updateWorkerStatus: UpdateWorkerStatus;
  getWeeksByCursor: GetWeeksByCursor;
  createWeek: CreateWeek;
  updateWeek: UpdateWeek;
  deleteWeek: DeleteWeek;
  getWeekRecords: GetWeekRecords;
  updateWeekRecord: UpdateWeekRecord;
  updateWeekRecordPayment: UpdateWeekRecordPayment;
  deleteWeekRecord: DeleteWeekRecord;
  createWeekRecord: CreateWeekRecord;
  getYearSummary: GetYearSummary;
  getYearsByCursor: GetYearByCursor;
  getSummaryWorkers: GetSummaryWorkers;
  getSummaryWorker: GetSummaryWorker;
  getWorkerRecords: GetWorkerRecords;
} = {
  createWorkPlace: async (data) => {
    try {
      const result = await apiClient.post(
        `/api/v1/worker/workplace/create`,
        data
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating workplace:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to create workplace. Please try again later.",
      };
    }
  },

  getWorkPlaces: async (page, limit, search) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/workplace/all?page=${page}&limit=${limit}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching workplaces:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to load workplaces. Please try again later.",
      };
    }
  },

  getWorkPlacesByCursor: async ({ take, cursor, search }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/workplace/cursor?take=${take}&cursor=${cursor}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching workplaces by cursor:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  updateWorkPlace: async (workPlaceData) => {
    try {
      const { id, ...rest } = workPlaceData;
      const result = await apiClient.patch(
        `/api/v1/worker/workplace/${id}`,
        rest
      );
      return result.data;
    } catch (error: any) {
      console.error("Error updating workplace:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to update workplace. Please try again later.",
      };
    }
  },

  deleteWorkPlace: async (id) => {
    try {
      const result = await apiClient.delete(`/api/v1/worker/workplace/${id}`);
      return result.data;
    } catch (error: any) {
      console.error("Error deleting workplace:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to delete workplace. Please try again later.",
      };
    }
  },

  createWorker: async (workerData) => {
    try {
      const result = await apiClient.post(`/api/v1/worker/create`, workerData);
      return result.data;
    } catch (error: any) {
      console.error("Error creating worker:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to create worker. Please try again later.",
      };
    }
  },

  getWorkers: async (page, limit, search) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/all?page=${page}&limit=${limit}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching workers:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to load workers. Please try again later.",
      };
    }
  },

  updateWorker: async (workerData) => {
    try {
      const { id, ...rest } = workerData;
      const result = await apiClient.patch(`/api/v1/worker/${id}`, rest);
      return result.data;
    } catch (error: any) {
      console.error("Error updating worker:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to update worker. Please try again later.",
      };
    }
  },

  deleteWorker: async (id) => {
    try {
      const result = await apiClient.delete(`/api/v1/worker/${id}`);
      return result.data;
    } catch (error: any) {
      console.error("Error deleting worker:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to delete worker. Please try again later.",
      };
    }
  },

  getWorkersByCursor: async ({ take, cursor, search }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/cursor?take=${take}&cursor=${cursor}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching workers by cursor:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  updateWorkerStatus: async ({ workerId, isActive }) => {
    try {
      const result = await apiClient.patch(
        `/api/v1/worker/${workerId}/status`,
        { isActive }
      );
      return result.data;
    } catch (error: any) {
      console.error("Error updating worker status:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to update worker status. Please try again later.",
      };
    }
  },

  getWeeksByCursor: async ({ workplaceId, cursor, take, search }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/week/cursor/${workplaceId}?take=${take}&cursor=${
          cursor ?? ""
        }&search=${search ?? ""}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching weeks:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to load weeks. Please try again later.",
      };
    }
  },

  createWeek: async (weekData) => {
    try {
      const result = await apiClient.post(
        `/api/v1/worker/week/create`,
        weekData
      );
      return result.data;
    } catch (error: any) {
      console.error("Error creating week:", error);
      return {
        status: "failed",
        message:
          error.response?.data?.message ||
          "Failed to create week. Please try again later.",
      };
    }
  },

  updateWeek: async (weekData) => {
    const { weekId, weekStart } = weekData;
    try {
      const response = await apiClient.put(`/api/v1/worker/week/${weekId}`, {
        weekStart,
      });
      if (response.status === 200) {
        return {
          status: "success",
          message: response.data.message,
          week: response.data.week,
        };
      }
      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error updating week:", error);
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  deleteWeek: async ({ weekId, workplaceId }) => {
    try {
      const response = await apiClient.delete(
        `/api/v1/worker/week/${weekId}/${workplaceId}`
      );
      if (response.status === 200) {
        return {
          status: "success",
          message: response.data.message,
          week: response.data.week,
          nextWeekId: response.data.nextWeekId,
        };
      }
      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error deleting week:", error);
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  getWeekRecords: async ({ weekId, workplaceId }) => {
    try {
      const response = await apiClient.get(
        `/api/v1/worker/week-record/${weekId}/${workplaceId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching week records:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  updateWeekRecord: async (recordData) => {
    const { id, ...rest } = recordData;
    try {
      const response = await apiClient.patch(
        `/api/v1/worker/week-record/update/${id}`,
        rest
      );
      if (response.status === 200) {
        return {
          status: "success",
          message: response.data.message,
          record: response.data.record,
        };
      }
      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error updating week record:", error);
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  updateWeekRecordPayment: async (recordData) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/worker/week-record/payment/${recordData.type}/${recordData.recordId}`
      );
      if (response.status === 200) {
        return {
          status: "success",
          message: response.data.message,
          record: response.data.record,
        };
      }
      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error updating week record:", error);
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  deleteWeekRecord: async (recordId) => {
    try {
      const response = await apiClient.delete(
        `/api/v1/worker/week-record/delete/${recordId}`
      );
      if (response.status === 200) {
        return {
          status: "success",
          message: response.data.message,
          record: response.data.record,
        };
      }
      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error("Error deleting record:", error);
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  createWeekRecord: async ({ weekId, workerId }) => {
    try {
      const response = await apiClient.post(
        `/api/v1/worker/week-record/create`,
        { weekId, workerId }
      );
      if (response.status === 201) {
        return {
          status: "success",
          message: response.data.message,
          record: response.data.record,
        };
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (err: any) {
      console.error("Error creating week record:", err);
      const { status, data } = err.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  getYearSummary: async ({ year, workplaceId }) => {
    try {
      const response = await apiClient.get(
        `/api/v1/worker/year-record/${year}/${workplaceId}`
      );
      if (response.status === 200) {
        return {
          status: "success",
          message: response.data.message,
          nextYear: response.data.nextYear,
          prevYear: response.data.prevYear,
          records: response.data.records,
        };
      }

      return {
        status: "failed",
        message: "Unexpected response from server.",
      };
    } catch (error: any) {
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        return {
          status: "failed",
          message: data.errors[0].message || "Validation error",
        };
      }
      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  getYearsByCursor: async ({ take, cursor, search, workplaceId }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/year/cursor/${workplaceId}?take=${take}&cursor=${cursor}&search=${search}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching year by cursor:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  getSummaryWorkers: async ({ workplaceId, weekId }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/summary/${workplaceId}/${weekId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching summary:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  getSummaryWorker: async (workerId) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/summary-worker/${workerId}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching summary:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },

  getWorkerRecords: async ({ limit, page, workerId }) => {
    try {
      const result = await apiClient.get(
        `/api/v1/worker/week-workplace/${workerId}?limit=${limit}&page=${page}`
      );
      return result.data;
    } catch (error: any) {
      console.error("Error fetching worker records:", error);
      const { status, data } = error.response;
      if (status === 400) {
        return {
          status: "failed",
          message: data.errors[0].message,
        };
      }

      return {
        status: "failed",
        message:
          data.message || "No response from server. Please try again later.",
      };
    }
  },
};
