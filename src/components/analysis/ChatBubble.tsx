import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/agentService';

interface ChatBubbleProps {
  message: ChatMessage;
  onSuggestionClick?: (text: string) => void;
}

// Render markdown-like bold **text** dan newlines
function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      // Blockquote: > text
      if (part.startsWith('> ')) {
        return (
          <span key={j} className="block border-l-2 border-brand-300 pl-2 italic text-gray-600 my-1">
            {part.slice(2)}
          </span>
        );
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatBubble({ message, onSuggestionClick }: ChatBubbleProps) {
  const isAgent = message.role === 'agent';

  return (
    <div className={cn('flex gap-2.5 group', isAgent ? 'flex-row' : 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
          isAgent ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
        )}
      >
        {isAgent ? 'AI' : 'U'}
      </div>

      {/* Bubble + suggestions */}
      <div className={cn('flex flex-col gap-2 max-w-[85%]', isAgent ? 'items-start' : 'items-end')}>
        {/* Bubble */}
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
            isAgent
              ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'
              : 'bg-brand-600 text-white rounded-tr-sm',
          )}
        >
          {message.isTyping ? (
            // Typing indicator
            <div className="flex items-center gap-2">
              {message.content ? (
                <span>{renderContent(message.content)}</span>
              ) : (
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
              {message.content && (
                <Loader2 className="w-3 h-3 text-gray-400 animate-spin shrink-0" />
              )}
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{renderContent(message.content)}</span>
          )}
        </div>

        {/* Waktu */}
        <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
          {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Quick suggestion chips */}
        {isAgent && message.suggestions && message.suggestions.length > 0 && !message.isTyping && (
          <div className="flex flex-wrap gap-1.5">
            {message.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestionClick?.(s)}
                className="text-xs px-2.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Auto-scroll sentinel
export function ChatScrollAnchor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  });
  return <div ref={ref} />;
}
