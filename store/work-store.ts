import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorkViewMode = "card" | "timeline";

interface WorkViewState {
  selectedWorkId: string | null;
  setSelectedWorkId: (id: string | null) => void;
  viewMode: WorkViewMode;
  setViewMode: (mode: WorkViewMode) => void;
}

export const useWorkViewStore = create<WorkViewState>()(
  persist(
    (set) => ({
      selectedWorkId: null,
      setSelectedWorkId: (id) => set({ selectedWorkId: id }),
      viewMode: "card",
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: "portfolio-work-view",
    }
  )
);
