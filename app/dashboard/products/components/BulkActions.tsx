"use client";

import React from "react";
import { Trash2, ToggleLeft, ToggleRight, MoreVertical } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onToggleStatus?: (status: "active" | "inactive") => void;
  onClearSelection: () => void;
}

export const BulkActions = ({
  selectedCount,
  onDelete,
  onToggleStatus,
  onClearSelection,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-900">
          {selectedCount} {selectedCount === 1 ? "product" : "products"} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          Clear selection
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onToggleStatus && (
          <>
            <button
              onClick={() => onToggleStatus("active")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <ToggleRight size={16} />
              Activate
            </button>
            <button
              onClick={() => onToggleStatus("inactive")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-600 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <ToggleLeft size={16} />
              Deactivate
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

