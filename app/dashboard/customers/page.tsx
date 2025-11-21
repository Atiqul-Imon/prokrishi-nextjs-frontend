"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getResourceList } from "@/app/utils/api";
import { User, Users, TrendingUp, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { useDebounce } from "use-debounce";
import { Card, CardContent } from "../components/Card";
import { MetricCard } from "../components/MetricCard";
import { CustomerRow } from "./components/CustomerRow";
import { CustomerSearch } from "./components/CustomerSearch";
import { TableSkeleton } from "../components/SkeletonLoader";
import Pagination from "../products/Pagination";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<any>({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<any>({ role: "all" });
  const { messages, error: showError, removeMessage } = useInlineMessage();

  const router = useRouter();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = `?page=${page}&limit=20&search=${debouncedSearchTerm}`;
      if (filters.role && filters.role !== "all") {
        query += `&role=${filters.role}`;
      }
      const data = await getResourceList("user", query);
      setCustomers(data.data || []);
      setPagination(data.pagination || {});
    } catch (err: any) {
      const errorMessage = err.message || "Error loading customers";
      setError(errorMessage);
      showError(errorMessage, 5000);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/customers/${id}`);
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
      setSelectedIds(new Set(customers.map((c) => c._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // Calculate stats
  const totalCustomers = pagination.total || customers.length;
  const adminCount = customers.filter((c) => c.role === "admin" || c.role === "super_admin").length;
  const customerCount = customers.filter((c) => c.role === "user").length;

  const allSelected = customers.length > 0 && customers.every((c) => selectedIds.has(c._id));
  const someSelected = customers.some((c) => selectedIds.has(c._id));

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


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Regular Customers"
          value={customerCount.toLocaleString()}
          icon={User}
          color="emerald"
          loading={loading}
        />
        <MetricCard
          title="Administrators"
          value={adminCount.toLocaleString()}
          icon={TrendingUp}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <CustomerSearch
            onSearch={setSearchTerm}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12">
              <TableSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6">
              <div className="text-rose-600 text-lg font-black mb-2">Error Loading Customers</div>
              <div className="text-gray-700">{error}</div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 px-6">
              <User className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-sm font-black text-gray-900 mb-1">No customers found</h3>
              <p className="text-sm text-gray-700">No customers match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      {handleSelect && (
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(input) => {
                              if (input) input.indeterminate = someSelected && !allSelected;
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-5 h-5 text-amber-600 border-gray-400 rounded focus:ring-amber-500 cursor-pointer bg-white"
                          />
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <CustomerRow
                        key={customer._id}
                        customer={customer}
                        onView={handleRowClick}
                        isSelected={selectedIds.has(customer._id)}
                        onSelect={handleSelect}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <Pagination
                    currentPage={pagination.page || page}
                    totalPages={pagination.totalPages || 1}
                    totalItems={pagination.total || customers.length}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
