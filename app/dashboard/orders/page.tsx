"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Download,
  RefreshCw,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  getAdminOrders,
  getAdminOrderStats,
  updateAdminOrderStatus,
  deleteAdminOrder,
  AdminOrderFilters,
} from "@/app/utils/api";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MetricCard } from "../components/MetricCard";
import { Card, CardContent } from "../components/Card";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { OrderRow } from "./components/OrderRow";
import { OrderFilters } from "./components/OrderFilters";
import { OrderBulkActions } from "./components/OrderBulkActions";
import { TableSkeleton } from "../components/SkeletonLoader";
import Pagination from "../products/Pagination";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminOrders(filters);
      setOrders(response.orders || []);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
      showError("Failed to fetch orders", 5000);
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await getAdminOrderStats(30);
      setStats(response.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleDeleteOrder = (orderId: string) => {
    setDeleteConfirm(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteAdminOrder(deleteConfirm);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteConfirm);
        return next;
      });
      success("Order deleted successfully", 5000);
      fetchOrders();
      setDeleteConfirm(null);
    } catch (err: any) {
      showError("Failed to delete order", 5000);
      setDeleteConfirm(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedIds).map((id) => deleteAdminOrder(id));
      await Promise.all(deletePromises);
      setSelectedIds(new Set());
      success(`${selectedIds.size} orders deleted successfully!`, 5000);
      fetchOrders();
      setBulkDeleteConfirm(false);
    } catch (err: any) {
      showError("Failed to delete orders", 5000);
      setBulkDeleteConfirm(false);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      const updatePromises = Array.from(selectedIds).map((id) =>
        updateAdminOrderStatus(id, status)
      );
      await Promise.all(updatePromises);
      success(`${selectedIds.size} orders updated to ${status}`, 5000);
      setSelectedIds(new Set());
      fetchOrders();
    } catch (err: any) {
      showError("Failed to update order statuses", 5000);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when other filters change
    }));
  };

  const handlePageChange = (page: number) => {
    handleFilterChange("page", page);
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(orders.map((o) => o._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o._id));
  const someSelected = orders.some((o) => selectedIds.has(o._id));

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Orders", href: "/dashboard/orders" }]} />

      {/* Inline Messages */}
      <div className="space-y-2">
        {messages.map((msg) => (
          <InlineMessage
            key={msg.id}
            type={msg.type}
            message={msg.message}
            onClose={() => removeMessage(msg.id)}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Multiple Orders"
        message={`Are you sure you want to delete ${selectedIds.size} order(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Orders"
            value={stats.totalOrders?.toLocaleString() || "0"}
            icon={ShoppingCart}
            color="blue"
            trend={{ value: 0, label: "all time", isPositive: true }}
            loading={statsLoading}
          />
          <MetricCard
            title="Total Revenue"
            value={`৳${(stats.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="emerald"
            trend={{ value: 0, label: `Last 30 days: ৳${(stats.periodRevenue || 0).toLocaleString()}`, isPositive: true }}
            loading={statsLoading}
          />
          <MetricCard
            title="Pending Orders"
            value={stats.statusBreakdown?.pending || 0}
            icon={Clock}
            color="amber"
            loading={statsLoading}
          />
          <MetricCard
            title="Delivered Orders"
            value={stats.statusBreakdown?.delivered || 0}
            icon={CheckCircle}
            color="emerald"
            loading={statsLoading}
          />
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <OrderFilters filters={filters} onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <OrderBulkActions
          selectedCount={selectedIds.size}
          onDelete={handleBulkDelete}
          onStatusUpdate={handleBulkStatusUpdate}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12">
              <TableSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Orders</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 px-6">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">No orders found</h3>
              <p className="text-sm text-slate-600">No orders match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {handleSelect && (
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(input) => {
                              if (input) input.indeterminate = someSelected && !allSelected;
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                          />
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {orders.map((order) => (
                      <OrderRow
                        key={order._id}
                        order={order}
                        onDelete={handleDeleteOrder}
                        isSelected={selectedIds.has(order._id)}
                        onSelect={handleSelect}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="border-t border-slate-200 p-4">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalOrders}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
