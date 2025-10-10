import { create } from "zustand";

type WorkerStore = {
  workerId: string;
  setWorkerId: (id: string) => void;
  workplaceId: string;
  setWorkplaceId: (id: string) => void;
  weekId: string;
  setWeekId: (id: string) => void;
  weekName: string | null;
  setWeekName: (name: string | null) => void;
  currentView: "weekly" | "yearly";
  setCurrentView: (view: "weekly" | "yearly") => void;
  currentViewInWeekly: "workers" | "workplaces";
  setCurrentViewInWeekly: (view: "workers" | "workplaces") => void;
};

export const useWorkerStore = create<WorkerStore>((set) => ({
  workerId: "",
  setWorkerId: (id) => set({ workerId: id }),
  workplaceId: "",
  setWorkplaceId: (id) => set({ workplaceId: id }),
  weekId: "",
  setWeekId: (id) => set({ weekId: id }),
  weekName: null,
  setWeekName: (name) => set({ weekName: name }),
  currentView: "weekly",
  setCurrentView: (view) => set({ currentView: view }),
  currentViewInWeekly: "workplaces",
  setCurrentViewInWeekly: (view) => set({ currentViewInWeekly: view }),
}));

type YearStore = {
  workplaceId: string;
  setWorkplaceId: (id: string) => void;
  year: string | null;
  setYear: (year: string | null) => void;
};

export const useYearStore = create<YearStore>((set) => ({
  workplaceId: "",
  setWorkplaceId: (id) => set({ workplaceId: id }),
  year: null,
  setYear: (year) => set({ year: year }),
}));
