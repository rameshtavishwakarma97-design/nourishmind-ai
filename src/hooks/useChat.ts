import { useState, useCallback, useRef } from 'react';
import { invokeFunction } from '@/lib/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  intent: string;
  responseType: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdCounter = useRef(0);

  const genId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history for context (last 10 messages)
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const { data, error: invokeError } = await invokeFunction<
        { message: string; conversationHistory: typeof history },
        ChatResponse
      >('chat', { message: text, conversationHistory: history });

      if (invokeError || !data) throw invokeError || new Error('No response');

      const aiMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: data.response,
        intent: data.intent,
        metadata: data.metadata,
        timestamp: data.timestamp,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errMsg);

      // Add error message as system feedback
      const errorMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: `Sorry, something went wrong: ${errMsg}. Please try again.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
