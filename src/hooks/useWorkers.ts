import { workersService } from "@/services/workers";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "./use-toast";
import type {
  UpdateWeekRecordInput,
  UpdateWeekRecordPaymentInput,
} from "@/types/models";

export const queryKeysWorkers = {
  workerRecords: (workerId: string, limit: number, page: number) => [
    "worker-records",
    workerId,
    limit,
    page,
  ],
  workplaceRoot: ["workplaces"] as const,
  workplaces: (page: number, limit: number, search: string) => [
    "workplaces",
    page,
    limit,
    search,
  ],
  workplaceCursorRoot: ["workplaces-cursor"] as const,
  workplaceCursor: (take: number, cursor: string, search: string) => [
    "workplaces-cursor",
    take,
    cursor,
    search,
  ],
  weeksCursorRoot: (workplaceId: string) =>
    ["weeks-cursor", workplaceId] as const,
  weeksCursor: (
    workplaceId: string,
    take: number,
    cursor: string,
    search: string
  ) => ["weeks-cursor", workplaceId, take, cursor, search],
  yearsCursorRoot: (workplaceId: string) =>
    ["years-cursor", workplaceId] as const,
  yearsCursor: (
    workplaceId: string,
    take: number,
    cursor: string,
    search: string
  ) => ["years-cursor", workplaceId, take, cursor, search],
  workersRoot: ["workers"] as const,
  workers: (active: string[], page: number, limit: number, search: string) => [
    "workers",
    active,
    page,
    limit,
    search,
  ],
  workersCursorRoot: ["workers-cursor"] as const,
  workersCursor: (take: number, cursor: string, search: string) => [
    "workers-cursor",
    take,
    cursor,
    search,
  ],
  weekRecords: (weekId: string, workplaceId: string) => [
    "week-records",
    weekId,
    workplaceId,
  ],
  yearRecords: (year: string | null, workplaceId: string) => [
    "year-records",
    year,
    workplaceId,
  ],
  workersSummary: (workplaceId: string, weekId: string) => [
    "workers-summary",
    workplaceId,
    weekId,
  ],
  workerSummary: (workerId: string) => ["worker-summary", workerId],
};

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || "Something went wrong",
    variant: "destructive",
  });
}

export function useWorkPlaces(page: number, limit: number, search = "") {
  return useQuery({
    queryKey: queryKeysWorkers.workplaces(page, limit, search),
    queryFn: () => workersService.getWorkPlaces(page, limit, search),
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev,
  });
}

export function useWorkPlacesByCursor(take: number, search = "") {
  return useInfiniteQuery({
    queryKey: queryKeysWorkers.workplaceCursor(take, "", search),
    queryFn: ({ pageParam }) =>
      workersService.getWorkPlacesByCursor({
        take,
        cursor: pageParam,
        search,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev,
  });
}

export function useCreateWorkPlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workersService.createWorkPlace,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating workplace",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "workplace created successfully",
        description: data.message || "workplace has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating workplace", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workplaceRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateWorkplace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workersService.updateWorkPlace,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating workplace",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Workplace updated successfully",
        description: data.message || "Workplace has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating Workplace", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workplaceRoot,
        exact: false,
      });
    },
  });
}

export function useDeleteWorkplace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workersService.deleteWorkPlace,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting workplace",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Workplace deleted successfully",
        description: data.message || "Workplace has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting Workplace", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workplaceRoot,
        exact: false,
      });
    },
  });
}

export function useWorkers(
  active: string[],
  page: number,
  limit: number,
  search = ""
) {
  return useQuery({
    queryKey: queryKeysWorkers.workers(active, page, limit, search),
    queryFn: () => workersService.getWorkers(active, page, limit, search),
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev,
  });
}

export function useCreateWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workersService.createWorker,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating worker",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "worker created successfully",
        description: data.message || "worker has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating worker", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workersRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workersService.updateWorker,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating worker",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "worker updated successfully",
        description: data.message || "worker has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating worker", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workersRoot,
        exact: false,
      });
    },
  });
}

export function useWorkersByCursor(take: number, search = "") {
  return useInfiniteQuery({
    queryKey: queryKeysWorkers.workersCursor(take, "", search),
    queryFn: ({ pageParam }) =>
      workersService.getWorkersByCursor({
        take,
        cursor: pageParam,
        search,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev,
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workersService.deleteWorker,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting worker",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "worker deleted successfully",
        description: data.message || "worker has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting worker", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workersRoot,
        exact: false,
      });
    },
  });
}

export function useUpdateWorkerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workersService.updateWorkerStatus,
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating worker status",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "worker status updated successfully",
        description:
          data.message || "worker status has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating worker status", error),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.workersRoot,
        exact: false,
      });
    },
  });
}

export function useWeeksByCursor(
  workplaceId: string,
  take: number,
  search = ""
) {
  return useInfiniteQuery({
    queryKey: queryKeysWorkers.weeksCursor(workplaceId, take, "", search),
    queryFn: ({ pageParam }) =>
      workersService.getWeeksByCursor({
        workplaceId,
        take,
        cursor: pageParam,
        search,
      }),
    initialPageParam: "",
    enabled: !!workplaceId,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev,
  });
}

export function useCreateWeek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weekStart,
      workplaceId,
    }: {
      workplaceId: string;
      weekStart: string;
    }) => workersService.createWeek({ weekStart, workplaceId }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating week",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "week created successfully",
        description: data.message || "week has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating week", error),
    onSettled: (_, __, variables) => {
      const { workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weeksCursorRoot(workplaceId),
        exact: false,
      });
    },
  });
}

export function useUpdateWeek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      weekId,
      weekStart,
      workplaceId: _workplaceId,
    }: {
      weekStart: string;
      weekId: string;
      workplaceId: string;
    }) => workersService.updateWeek({ weekId, weekStart }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating week",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "week updated successfully",
        description: data.message || "week has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error updating week", error),
    onSettled: (_, __, variables) => {
      const { workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weeksCursorRoot(workplaceId),
        exact: false,
      });
    },
  });
}

export function useDeleteWeek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workplaceId,
      weekId,
    }: {
      workplaceId: string;
      weekId: string;
    }) => workersService.deleteWeek({ weekId, workplaceId }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting week",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "week deleted successfully",
        description: data.message || "week has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting week", error),
    onSettled: (_, __, variables) => {
      const { workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weeksCursorRoot(workplaceId),
        exact: false,
      });
    },
  });
}

export function useWeekRecords(weekId: string, workplaceId: string) {
  return useQuery({
    queryKey: queryKeysWorkers.weekRecords(weekId, workplaceId),
    queryFn: () => workersService.getWeekRecords({ weekId, workplaceId }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!weekId && !!workplaceId,
  });
}

export function useUpdateWeekRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordData,
      weekId: _weekId,
      workplaceId: _workplaceId,
    }: {
      weekId: string;
      workplaceId: string;
      recordData: UpdateWeekRecordInput;
    }) => workersService.updateWeekRecord(recordData),

    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating week record",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Week record updated successfully",
        description:
          data.message || "Week record has been updated successfully.",
        variant: "default",
      });
    },

    onError: (error) => showErrorToast("Error updating week record", error),

    onSettled: (_, __, variables) => {
      const { weekId, workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weekRecords(weekId, workplaceId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["worker-records"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["worker-summary"],
        exact: false,
      });
    },
  });
}

export function useUpdateWeekRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordData,
      weekId: _weekId,
      workplaceId: _workplaceId,
    }: {
      weekId: string;
      workplaceId: string;
      recordData: UpdateWeekRecordPaymentInput;
    }) => workersService.updateWeekRecordPayment(recordData),

    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error updating week record",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Week record updated successfully",
        description:
          data.message || "Week record has been updated successfully.",
        variant: "default",
      });
    },

    onError: (error) => showErrorToast("Error updating week record", error),

    onSettled: (_, __, variables) => {
      const { weekId, workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weekRecords(weekId, workplaceId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["worker-records"],
        exact: false,
      });
    },
  });
}

export function useDeleteWeekRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      weekId: _weekId,
      workplaceId: _workplaceId,
      recordId,
    }: {
      weekId: string;
      workplaceId: string;
      recordId: string;
    }) => workersService.deleteWeekRecord(recordId),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error deleting week record",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "week record deleted successfully",
        description:
          data.message || "week record has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error deleting week", error),
    onSettled: (_, __, variables) => {
      const { weekId, workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weekRecords(weekId, workplaceId),
      });
      queryClient.invalidateQueries({
        queryKey: ["worker-records"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["worker-summary"],
        exact: false,
      });
    },
  });
}

export function useCreateWeekRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      weekId,
      workplaceId: _workplaceId,
      workerId,
    }: {
      weekId: string;
      workplaceId: string;
      workerId: string;
    }) => workersService.createWeekRecord({ weekId, workerId }),
    onSuccess: async (data) => {
      if (data.status === "failed") {
        toast({
          title: "Error creating week record",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "week record created successfully",
        description:
          data.message || "week record has been created successfully.",
        variant: "default",
      });
    },
    onError: (error) => showErrorToast("Error creating week record", error),
    onSettled: (_, __, variables) => {
      const { weekId, workplaceId } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeysWorkers.weekRecords(weekId, workplaceId),
      });
    },
  });
}

export function useYearRecords(year: string | null, workplaceId: string) {
  return useQuery({
    queryKey: queryKeysWorkers.yearRecords(year, workplaceId),
    queryFn: () => workersService.getYearSummary({ year: year!, workplaceId }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!year && !!workplaceId,
  });
}

export function useYearsByCursor(
  workplaceId: string,
  take: number,
  search = ""
) {
  return useInfiniteQuery({
    queryKey: queryKeysWorkers.yearsCursor(workplaceId, take, "", search),
    queryFn: ({ pageParam }) =>
      workersService.getYearsByCursor({
        workplaceId,
        take,
        cursor: pageParam,
        search,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!workplaceId,
    placeholderData: (prev) => prev,
  });
}

export function useSummaryWorkers({
  weekId,
  workplaceId,
}: {
  weekId: string;
  workplaceId: string;
}) {
  return useQuery({
    queryKey: queryKeysWorkers.workersSummary(workplaceId, weekId),
    queryFn: () => workersService.getSummaryWorkers({ weekId, workplaceId }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!weekId && !!workplaceId,
  });
}

export function useWorkerRecords(
  page: number,
  limit: number,
  workerId: string
) {
  return useQuery({
    queryKey: queryKeysWorkers.workerRecords(workerId, limit, page),
    queryFn: () => workersService.getWorkerRecords({ page, limit, workerId }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!workerId,
  });
}

export function useSummaryWorker(workerId: string) {
  return useQuery({
    queryKey: queryKeysWorkers.workerSummary(workerId),
    queryFn: () => workersService.getSummaryWorker(workerId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!workerId,
  });
}
