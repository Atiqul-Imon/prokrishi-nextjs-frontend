"use client";

import { useState, useCallback } from "react";
import { MessageType } from "@/components/InlineMessage";

interface Message {
  type: MessageType;
  message: string;
  id: string;
}

export function useInlineMessage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const showMessage = useCallback((type: MessageType, message: string, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newMessage: Message = { type, message, id };

    setMessages((prev) => [...prev, newMessage]);

    if (duration && duration > 0) {
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    showMessage,
    removeMessage,
    clearMessages,
    success: (message: string, duration?: number) => showMessage("success", message, duration),
    error: (message: string, duration?: number) => showMessage("error", message, duration),
    warning: (message: string, duration?: number) => showMessage("warning", message, duration),
    info: (message: string, duration?: number) => showMessage("info", message, duration),
  };
}

