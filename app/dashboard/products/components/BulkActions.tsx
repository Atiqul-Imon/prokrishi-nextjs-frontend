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
    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl shadow-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-black text-gray-900">
          {selectedCount} {selectedCount === 1 ? "product" : "products"} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs text-gray-700 hover:text-gray-900 font-bold transition-colors"
        >
          Clear selection
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onToggleStatus && (
          <>
            <button
              onClick={() => onToggleStatus("active")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all shadow-lg"
            >
              <ToggleRight size={16} />
              Activate
            </button>
            <button
              onClick={() => onToggleStatus("inactive")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 text-white text-sm font-bold hover:bg-gray-600 transition-all"
            >
              <ToggleLeft size={16} />
              Deactivate
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all shadow-lg"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

