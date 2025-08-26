import { dashboardService } from "@/services/dashboard";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
// import { toast } from './use-toast'

export const queryKeys = {
  generalSettings: ["generalSettings"],
  summary: (seasonId: string) => ["summary", seasonId],
  retardOrdersFaconnier: (seasonId: string) => [
    "retardOrdersFaconnier",
    seasonId,
  ],
};

// function showErrorToast(title: string, error: any) {
//   toast({
//     title,
//     description: error?.message || 'Something went wrong',
//     variant: 'destructive'
//   })
// }

export function useGeneralSettings() {
  return useQuery({
    queryKey: queryKeys.generalSettings,
    queryFn: dashboardService.getGeneralSettings,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useSummary() {
  const { activeSeason } = useUserStore();

  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.summary(seasonId),
    queryFn: () => dashboardService.getSummary(seasonId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId,
  });
}

export function useRetardOrdersFaconnier() {
  const { activeSeason } = useUserStore();

  const seasonId = activeSeason?.id || "";

  return useQuery({
    queryKey: queryKeys.retardOrdersFaconnier(seasonId),
    queryFn: () => dashboardService.getRetardOrdersFaconnier(seasonId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!seasonId,
  });
}
