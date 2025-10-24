"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Eye, 
  Download,
  Image as ImageIcon,
  Video,
  FileText,
  MoreVertical,
  X,
  Check,
  AlertCircle
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

export default function MediaGallery() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<MediaStats | null>(null);
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
      const response = await getAllMedia(filters);
      setMediaFiles(response.mediaFiles);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getMediaStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Gallery</h1>
        <p className="text-gray-600">Manage your media files and assets</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-lg font-semibold">{stats.totalFiles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-lg font-semibold">{stats.imageCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-lg font-semibold">{stats.videoCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-lg font-semibold">{stats.documentCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search media..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedFiles.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedFiles.length})
              </button>
            )}
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : mediaFiles.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No media files found</p>
        </div>
      ) : (
        <>
          {/* Select All */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFiles.length === mediaFiles.length && mediaFiles.length > 0}
                onChange={handleSelectAll}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
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
                className={`relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleFileSelect(file.id)}
                  className="absolute top-2 left-2 z-10"
                />
                
                {viewMode === 'grid' ? (
                  <div className="aspect-square">
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-2xl">{getFileIcon(file.format)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(file.id)}
                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {viewMode === 'grid' && (
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 gap-2">
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Media</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="e.g., product, banner, logo"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || uploadFiles.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold">Delete Media</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this media file? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
