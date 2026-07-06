import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult, User, UploadStatus } from '@/types';
import type { ChatMessage } from '@/lib/agentService';
import { type Locale, detectLocale } from '@/i18n';

/** Apply/remove the `dark` class on <html> and update color-scheme */
export function applyDarkMode(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

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

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;

  // Locale / Language
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // AI Chat — per analisis (key = analysisId)
  chatSessions: Record<string, ChatMessage[]>;
  addChatMessage: (analysisId: string, message: ChatMessage) => void;
  updateChatMessage: (analysisId: string, messageId: string, update: Partial<ChatMessage>) => void;
  clearChatSession: (analysisId: string) => void;
  chatPanelOpen: boolean;
  setChatPanelOpen: (open: boolean) => void;
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
          history: [result, ...state.history].slice(0, 50),
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),

      // Locale
      locale: detectLocale(),
      setLocale: (locale) => set({ locale }),

      // Dark Mode
      darkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode;
          applyDarkMode(next);
          return { darkMode: next };
        }),
      setDarkMode: (dark: boolean) => {
        applyDarkMode(dark);
        set({ darkMode: dark });
      },

      // UI
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // AI Chat
      chatSessions: {},
      addChatMessage: (analysisId, message) =>
        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [analysisId]: [...(state.chatSessions[analysisId] ?? []), message],
          },
        })),
      updateChatMessage: (analysisId, messageId, update) =>
        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [analysisId]: (state.chatSessions[analysisId] ?? []).map((msg) =>
              msg.id === messageId ? { ...msg, ...update } : msg,
            ),
          },
        })),
      clearChatSession: (analysisId) =>
        set((state) => {
          const next = { ...state.chatSessions };
          delete next[analysisId];
          return { chatSessions: next };
        }),
      chatPanelOpen: false,
      setChatPanelOpen: (open) => set({ chatPanelOpen: open }),
    }),
    {
      name: 'contractguard-storage',
      partialize: (state) => ({
        user: state.user,
        history: state.history,
        chatSessions: state.chatSessions,
        locale: state.locale,
        darkMode: state.darkMode,
      }),
    },
  ),
);
