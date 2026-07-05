import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import {
  sendMessage,
  getWelcomeMessage,
  generateMessageId,
  type ChatMessage,
} from '@/lib/agentService';
import type { AnalysisResult } from '@/types';

export function useAgent(analysis: AnalysisResult | null) {
  const {
    chatSessions,
    addChatMessage,
    updateChatMessage,
    clearChatSession,
    chatPanelOpen,
    setChatPanelOpen,
  } = useAppStore();

  const isTypingRef = useRef(false);
  const analysisId = analysis?.id ?? '';
  const messages: ChatMessage[] = chatSessions[analysisId] ?? [];

  /**
   * Inisialisasi sesi chat — tambah pesan selamat datang jika belum ada
   */
  const initSession = useCallback(() => {
    if (!analysis) return;
    if ((chatSessions[analysis.id] ?? []).length === 0) {
      const welcome = getWelcomeMessage(analysis);
      addChatMessage(analysis.id, welcome);
    }
  }, [analysis, chatSessions, addChatMessage]);

  /**
   * Kirim pesan pengguna dan dapatkan respons agent
   */
  const sendUserMessage = useCallback(
    async (text: string) => {
      if (!analysis || !text.trim() || isTypingRef.current) return;

      isTypingRef.current = true;

      // 1. Tambah pesan user
      const userMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };
      addChatMessage(analysis.id, userMsg);

      // 2. Tambah placeholder "agent typing"
      const typingId = generateMessageId();
      const typingMsg: ChatMessage = {
        id: typingId,
        role: 'agent',
        content: '',
        timestamp: new Date(),
        isTyping: true,
      };
      addChatMessage(analysis.id, typingMsg);

      try {
        // 3. Panggil agent service dengan streaming
        const { content, suggestions } = await sendMessage(
          text,
          {
            analysis,
            conversationHistory: chatSessions[analysis.id] ?? [],
          },
          (streamed) => {
            // Update pesan agent secara realtime (streaming effect)
            updateChatMessage(analysis.id, typingId, {
              content: streamed,
              isTyping: false,
            });
          },
        );

        // 4. Finalisasi pesan dengan suggestions
        updateChatMessage(analysis.id, typingId, {
          content,
          isTyping: false,
          suggestions,
        });
      } catch {
        updateChatMessage(analysis.id, typingId, {
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
          isTyping: false,
        });
      } finally {
        isTypingRef.current = false;
      }
    },
    [analysis, chatSessions, addChatMessage, updateChatMessage],
  );

  const clearSession = useCallback(() => {
    if (analysisId) {
      clearChatSession(analysisId);
      if (analysis) {
        const welcome = getWelcomeMessage(analysis);
        addChatMessage(analysis.id, welcome);
      }
    }
  }, [analysisId, analysis, clearChatSession, addChatMessage]);

  const openChat = useCallback(() => {
    setChatPanelOpen(true);
    // Inisialisasi sesi saat pertama kali dibuka
    if (analysis && (chatSessions[analysis.id] ?? []).length === 0) {
      const welcome = getWelcomeMessage(analysis);
      addChatMessage(analysis.id, welcome);
    }
  }, [analysis, chatSessions, setChatPanelOpen, addChatMessage]);

  const closeChat = useCallback(() => setChatPanelOpen(false), [setChatPanelOpen]);

  return {
    messages,
    isOpen: chatPanelOpen,
    openChat,
    closeChat,
    initSession,
    sendUserMessage,
    clearSession,
    hasMessages: messages.length > 0,
  };
}
