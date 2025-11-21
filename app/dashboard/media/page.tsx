"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Search, 
  Grid, 
  List, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Video,
  FileText,
  X,
  AlertCircle,
  ImagePlus
} from 'lucide-react';
import { 
  getAllMedia, 
  uploadMedia, 
  deleteMedia, 
  getMediaStats,
  formatFileSize,
  getFileIcon,
  MediaFile,
  MediaFilters,
  MediaStats
} from '@/app/utils/mediaApi';
import { Card, CardContent, CardHeader } from '../components/Card';
import { MetricCard } from '../components/MetricCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function MediaGallery() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MediaFilters>({
    page: 1,
    limit: 20,
    search: '',
    sort: 'createdAt',
    order: 'desc',
    type: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalFiles: 0,
    hasNext: false,
    hasPrev: false
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadTags, setUploadTags] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch media files
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMedia(filters);
      setMediaFiles(response.mediaFiles);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Error fetching media:', error);
      // Extract error message from response
      let errorMessage = 'Failed to fetch media files';
      if (error.response?.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      // Don't let API errors cause redirects - just show empty state
      setMediaFiles([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalFiles: 0,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getMediaStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      // Don't let API errors cause redirects - just set null stats
      setStats(null);
    }
  }, []);

  // Load data on mount and when filters change
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle search
  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof MediaFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle file selection
  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedFiles.length === mediaFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mediaFiles.map(file => file.id));
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    try {
      setUploading(true);
      const tags = uploadTags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      for (const file of uploadFiles) {
        await uploadMedia(file, tags);
      }
      
      setUploadFiles([]);
      setUploadTags('');
      setShowUploadModal(false);
      await fetchMedia();
      await fetchStats();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId: string) => {
    try {
      await deleteMedia(fileId);
      setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
      await fetchStats();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    try {
      for (const fileId of selectedFiles) {
        await deleteMedia(fileId);
      }
      setSelectedFiles([]);
      await fetchMedia();
      await fetchStats();
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Upload size={18} />
          Upload Media
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Files"
            value={stats.totalFiles?.toLocaleString() || "0"}
            icon={ImageIcon}
            color="blue"
            loading={loading}
          />
          <MetricCard
            title="Images"
            value={stats.imageCount?.toLocaleString() || "0"}
            icon={ImageIcon}
            color="emerald"
            loading={loading}
          />
          <MetricCard
            title="Videos"
            value={stats.videoCount?.toLocaleString() || "0"}
            icon={Video}
            color="purple"
            loading={loading}
          />
          <MetricCard
            title="Documents"
            value={stats.documentCount?.toLocaleString() || "0"}
            icon={FileText}
            color="amber"
            loading={loading}
          />
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
                />
              </div>
              
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>
              
              <select
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  handleFilterChange('sort', sort);
                  handleFilterChange('order', order);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Largest First</option>
                <option value="size-asc">Smallest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Media"
        message="Are you sure you want to delete this media file? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteConfirm) {
            handleDelete(deleteConfirm);
            setDeleteConfirm(null);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-1">Media Service Error</h3>
                <p className="text-sm text-amber-700">{error}</p>
                {error.includes('ImageKit') || error.includes('not configured') && (
                  <p className="text-xs text-amber-600 mt-2">
                    Please configure ImageKit environment variables in the backend.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media Grid/List */}
      {loading ? (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          </CardContent>
        </Card>
      ) : mediaFiles.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <ImagePlus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">No media files found</h3>
              <p className="text-sm text-slate-600 mb-4">
                {filters.search ? "Try adjusting your search" : error ? "Media service is currently unavailable" : "Upload your first media file to get started"}
              </p>
              {!filters.search && !error && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <Upload size={18} />
                  Upload Media
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Select All */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFiles.length === mediaFiles.length && mediaFiles.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Select All ({selectedFiles.length}/{mediaFiles.length})
              </span>
            </label>
          </div>

          {/* Media Files */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
            : 'space-y-2'
          }>
            {mediaFiles.map((file) => (
              <div
                key={file.id}
                className={`relative group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-emerald-500 border-emerald-300' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleFileSelect(file.id)}
                  className="absolute top-2 left-2 z-10 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                
                {viewMode === 'grid' ? (
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    {file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name || 'Media file'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">{getFileIcon(file.format)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center p-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                      {file.thumbnailUrl ? (
                        <img
                          src={file.thumbnailUrl}
                          alt={file.name || 'Media file'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{getFileIcon(file.format)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">
                        {formatFileSize(file.size)} • {file.format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="flex gap-1">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-slate-50 border border-slate-200"
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(file.id)}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-rose-50 border border-slate-200 text-rose-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Card>
                <CardContent>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-medium text-slate-700 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm font-medium text-slate-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 font-medium text-slate-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
            <CardHeader
              title="Upload Media"
              actions={
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              }
            />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                  />
                  {uploadFiles.length > 0 && (
                    <p className="mt-2 text-sm text-slate-600">
                      {uploadFiles.length} {uploadFiles.length === 1 ? 'file' : 'files'} selected
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    placeholder="e.g., product, banner, logo"
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || uploadFiles.length === 0}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
}
