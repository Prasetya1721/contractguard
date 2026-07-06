import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, RotateCcw, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgent } from '@/hooks/useAgent';
import { useTranslation } from '@/hooks/useTranslation';
import ChatBubble, { ChatScrollAnchor } from './ChatBubble';
import type { AnalysisResult } from '@/types';

interface ChatPanelProps {
  analysis: AnalysisResult;
}

export default function ChatPanel({ analysis }: ChatPanelProps) {
  const { messages, isOpen, openChat, closeChat, sendUserMessage, clearSession } = useAgent(analysis);
  const { t } = useTranslation();

  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isTyping = messages.some((m) => m.isTyping);

  useEffect(() => {
    if (isOpen && messages.length === 0) openChat();
  }, [isOpen, messages.length, openChat]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    await sendUserMessage(text);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [input, isTyping, sendUserMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={closeChat} />
      <div className={cn(
        'fixed z-50 flex flex-col bg-white border border-gray-200 shadow-2xl transition-all duration-300',
        'md:right-6 md:bottom-6 md:w-[380px] md:rounded-2xl',
        'inset-x-0 bottom-0 rounded-t-2xl md:inset-x-auto',
        minimized ? 'md:h-14' : 'h-[80vh] md:h-[600px]',
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-600 text-white rounded-t-2xl shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{t.agent.title}</p>
            <p className="text-xs text-brand-200 truncate">{analysis.documentName}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized((v) => !v)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors hidden md:flex" title={minimized ? t.agent.maximize : t.agent.minimize}>
              {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={clearSession} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title={t.agent.resetSession}>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={closeChat} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title={t.common.close}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 text-center">{t.agent.askAbout}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {t.agent.quickStarters.map((q) => (
                      <button key={q} onClick={() => sendUserMessage(q)}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-brand-400 hover:text-brand-700 transition-colors shadow-sm">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} onSuggestionClick={(text) => !isTyping && sendUserMessage(text)} />
              ))}
              <ChatScrollAnchor />
            </div>

            {/* Disclaimer */}
            <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-100">
              <p className="text-[10px] text-amber-700 text-center leading-tight">
                ⚠️ {t.agent.notLegalAdvice}
              </p>
            </div>

            {/* Input */}
            <div className="px-3 py-3 bg-white border-t border-gray-200 rounded-b-2xl shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.agent.inputPlaceholder}
                  rows={1}
                  disabled={isTyping}
                  className={cn('flex-1 resize-none text-sm px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition max-h-32 overflow-y-auto', isTyping && 'opacity-50')}
                  style={{ lineHeight: '1.5' }}
                />
                <button onClick={handleSend} disabled={!input.trim() || isTyping}
                  className={cn('flex items-center justify-center w-9 h-9 rounded-xl transition-colors shrink-0', input.trim() && !isTyping ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-100 text-gray-400')}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-center">{t.agent.enterHint}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
