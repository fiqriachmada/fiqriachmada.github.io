import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectViewState {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  viewMode: "grid" | "book";
  setViewMode: (mode: "grid" | "book") => void;
}

export const useProjectViewStore = create<ProjectViewState>()(
  persist(
    (set) => ({
      selectedProjectId: null,
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      viewMode: "grid",
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: "portfolio-project-view",
    }
  )
);
