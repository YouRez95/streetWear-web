import type { FullSeasonData, UserData } from "@/types/models";
import { create } from "zustand";

type UserStore = {
  userData: UserData | null;
  updateUserData: (data: UserData) => void;
  setUserDataAndIsLoggedIn: (data: UserData) => void;
  isLoggedIn: boolean;
  setLogout: () => void;
  seasons: FullSeasonData[];
  activeSeason: FullSeasonData | null;
  setActiveSeason: (season: FullSeasonData) => void;
  updateSeasons: (seassons: FullSeasonData[]) => void;
  selectedFaconnierId: string;
  setSelectedFaconnierId: (id: string) => void;
  selectedBonId: string;
  setSelectedBonId: (id: string) => void;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedClientBonId: string;
  setSelectedClientBonId: (id: string) => void;
  selectedStylistId: string;
  setSelectedStylistId: (id: string) => void;
  selectedStylistBonId: string;
  setSelectedStylistBonId: (id: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  updateUserData: (data) =>
    set((state) => ({ userData: { ...state.userData, ...data } })),
  setUserDataAndIsLoggedIn: (data) => set({ userData: data, isLoggedIn: true }),
  isLoggedIn: false,
  setLogout: () => set({ userData: null, isLoggedIn: false }),
  seasons: [],
  activeSeason: null,
  setActiveSeason: (season) => set({ activeSeason: season }),
  updateSeasons: (seassons) => set({ seasons: seassons }),
  selectedFaconnierId: "",
  setSelectedFaconnierId: (id) => set({ selectedFaconnierId: id }),
  selectedBonId: "",
  setSelectedBonId: (id) => set({ selectedBonId: id }),
  selectedClientId: "",
  setSelectedClientId: (id) => set({ selectedClientId: id }),
  selectedClientBonId: "",
  setSelectedClientBonId: (id) => set({ selectedClientBonId: id }),
  selectedStylistId: "",
  setSelectedStylistId: (id) => set({ selectedStylistId: id }),
  selectedStylistBonId: "",
  setSelectedStylistBonId: (id) => set({ selectedStylistBonId: id }),
}));
