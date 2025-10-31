"use client";

import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type MessageType = "success" | "error" | "warning" | "info";

interface InlineMessageProps {
  type: MessageType;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function InlineMessage({ type, message, onClose, className = "" }: InlineMessageProps) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${styles[type]} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

