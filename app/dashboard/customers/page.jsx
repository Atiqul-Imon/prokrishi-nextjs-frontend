"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getResourceList } from "@/app/utils/api";
import { User, Mail, Phone, Calendar, Shield, Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const router = useRouter();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = `?page=${page}&limit=10&search=${debouncedSearchTerm}`;
      const data = await getResourceList("user", query);
      setCustomers(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      const errorMessage = err.message || "Error loading customers";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  }, [page, debouncedSearchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleRowClick = (id) => {
    router.push(`/dashboard/customers/${id}`);
  };

  const TableRow = ({ customer }) => (
    <tr
      className="border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={() => handleRowClick(customer._id)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {customer.name}
            </div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{customer.phone}</div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            customer.role === "admin" || customer.role === "super_admin"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {customer.role}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(customer.createdAt)}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">
              View and manage your registered customers.
            </p>
        </div>
        <div className="mt-4 md:mt-0">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
            </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name / Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="4" className="text-center py-10">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <span className="ml-3 text-gray-500">Loading customers...</span>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                customers.length > 0 &&
                customers.map((customer) => (
                  <TableRow key={customer._id} customer={customer} />
                ))}
              {!loading && !error && customers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total results)
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setPage(page + 1)} disabled={page >= pagination.totalPages} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
