import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult, User, UploadStatus } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Upload & Analysis
  uploadStatus: UploadStatus;
  setUploadStatus: (status: UploadStatus) => void;
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (result: AnalysisResult | null) => void;

  // History
  history: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Upload & Analysis
      uploadStatus: { type: 'idle' },
      setUploadStatus: (status) => set({ uploadStatus: status }),
      currentAnalysis: null,
      setCurrentAnalysis: (result) => set({ currentAnalysis: result }),

      // History
      history: [],
      addToHistory: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 50), // maks 50 item
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),

      // UI
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'contractguard-storage',
      partialize: (state) => ({
        user: state.user,
        history: state.history,
      }),
    },
  ),
);
