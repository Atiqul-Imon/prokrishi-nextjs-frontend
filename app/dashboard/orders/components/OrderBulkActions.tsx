"use client";

import React from "react";
import { Trash2, Package, Truck, CheckCircle, X } from "lucide-react";

interface OrderBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusUpdate?: (status: string) => void;
  onClearSelection: () => void;
}

export const OrderBulkActions = ({
  selectedCount,
  onDelete,
  onStatusUpdate,
  onClearSelection,
}: OrderBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-900">
          {selectedCount} {selectedCount === 1 ? "order" : "orders"} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          Clear selection
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onStatusUpdate && (
          <>
            <button
              onClick={() => onStatusUpdate("processing")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <Package size={16} />
              Mark Processing
            </button>
            <button
              onClick={() => onStatusUpdate("shipped")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition-colors"
            >
              <Truck size={16} />
              Mark Shipped
            </button>
            <button
              onClick={() => onStatusUpdate("delivered")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle size={16} />
              Mark Delivered
            </button>
            <button
              onClick={() => onStatusUpdate("cancelled")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-600 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <X size={16} />
              Cancel
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

