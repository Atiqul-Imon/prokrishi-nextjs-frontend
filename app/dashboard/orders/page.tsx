"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  getAdminOrders,
  getAdminOrderStats,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  deleteAdminOrder,
  AdminOrderFilters,
} from "@/app/utils/api";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", icon: Clock },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300", icon: CheckCircle },
    processing: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300", icon: Package },
    shipped: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-300", icon: Truck },
    delivered: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300", icon: CheckCircle },
    cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300", icon: X },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border-2 ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
    failed: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
    cancelled: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${config.bg} ${config.text} ${config.border}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, color, subtitle = null }) => {
  const colorMap: { [key: string]: { border: string; bg: string; iconColor: string } } = {
    'border-l-blue-500': { border: 'border-l-4 border-blue-500', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    'border-l-green-500': { border: 'border-l-4 border-emerald-500', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    'border-l-yellow-500': { border: 'border-l-4 border-amber-500', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  };
  
  const colorConfig = colorMap[color] || colorMap['border-l-green-500'];
  
  return (
    <div className={`bg-white p-6 rounded-lg border-2 border-slate-200 ${colorConfig.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorConfig.bg} border-2 ${colorConfig.border.replace('border-l-4', 'border')}`}>
          <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { messages, success, error: showError, removeMessage } = useInlineMessage();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminOrders(filters);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
      showError("Failed to fetch orders", 5000);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getAdminOrderStats(30);
      setStats(response.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      success(`Order status updated to ${newStatus}`, 5000);
      fetchOrders();
    } catch (err: any) {
      showError("Failed to update order status", 5000);
    }
  };

  const handlePaymentUpdate = async (orderId, newPaymentStatus) => {
    try {
      await updateAdminPaymentStatus(orderId, newPaymentStatus);
      success(`Payment status updated to ${newPaymentStatus}`, 5000);
      fetchOrders();
    } catch (err: any) {
      showError("Failed to update payment status", 5000);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setDeleteConfirm(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteAdminOrder(deleteConfirm);
      success("Order deleted successfully", 5000);
      fetchOrders();
      setDeleteConfirm(null);
    } catch (err: any) {
      showError("Failed to delete order", 5000);
      setDeleteConfirm(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when other filters change
    }));
  };

  const handlePageChange = (page) => {
    handleFilterChange('page', page);
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-bold text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Delete Confirmation Dialog */}
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchOrders()}
            className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="border-l-blue-500"
          />
          <StatCard
            title="Total Revenue"
            value={`৳${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="border-l-green-500"
            subtitle={`Last 30 days: ৳${stats.periodRevenue.toLocaleString()}`}
          />
          <StatCard
            title="Pending Orders"
            value={stats.statusBreakdown.pending}
            icon={Clock}
            color="border-l-yellow-500"
          />
          <StatCard
            title="Delivered Orders"
            value={stats.statusBreakdown.delivered}
            icon={CheckCircle}
            color="border-l-green-500"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border-2 border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Orders</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium border-2 border-slate-200"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Order ID, customer name..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white font-medium"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Payment Status</label>
              <select
                value={filters.paymentStatus || ''}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white font-medium"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white font-medium"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="totalPrice-desc">Highest Amount</option>
                <option value="totalPrice-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-600 font-medium">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Orders</h3>
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-slate-100">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      <input
                        type="checkbox"
                        className="rounded border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y-2 divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                        <Link href={`/dashboard/orders/${order._id}`} className="hover:underline">
                          #{order._id.substring(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {order.userInfo?.name || "Guest"}
                          </div>
                          <div className="text-sm text-slate-600 font-medium">
                            {order.userInfo?.email || order.userInfo?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        ৳{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/orders/${order._id}`}
                            className="text-emerald-600 hover:text-emerald-800"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-slate-700 font-medium">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalOrders)} of{' '}
                  {pagination.totalOrders} orders
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 text-sm text-slate-700 bg-white border-2 border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-medium"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm rounded-lg font-bold ${
                        page === pagination.currentPage
                          ? 'bg-emerald-600 text-white border-2 border-emerald-700'
                          : 'text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 text-sm text-slate-700 bg-white border-2 border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-bold text-slate-900">No orders found</h3>
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  No orders match your current filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
