import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/api';

// Create axios instance with default config
const mediaApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
mediaApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
mediaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Media API interfaces
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  width?: number;
  height?: number;
  format: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPrivateFile: boolean;
  customMetadata?: Record<string, any>;
}

export interface MediaPagination {
  currentPage: number;
  totalPages: number;
  totalFiles: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  imageCount: number;
  videoCount: number;
  documentCount: number;
  recentUploads: MediaFile[];
}

export interface MediaFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'createdAt' | 'name' | 'size';
  order?: 'asc' | 'desc';
  type?: 'all' | 'image' | 'video' | 'document';
}

// Get all media files
export const getAllMedia = async (filters: MediaFilters = {}): Promise<{
  mediaFiles: MediaFile[];
  pagination: MediaPagination;
}> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);
    if (filters.type) params.append('type', filters.type);

    const response = await mediaApi.get(`/media?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Get media files error:', error);
    throw error;
  }
};

// Upload media file
export const uploadMedia = async (
  file: File,
  tags?: string[],
  customMetadata?: Record<string, any>
): Promise<MediaFile> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (tags && tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    
    if (customMetadata) {
      formData.append('customMetadata', JSON.stringify(customMetadata));
    }

    const response = await mediaApi.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.media;
  } catch (error) {
    console.error('Upload media error:', error);
    throw error;
  }
};

// Delete media file
export const deleteMedia = async (id: string): Promise<void> => {
  try {
    await mediaApi.delete(`/media/${id}`);
  } catch (error) {
    console.error('Delete media error:', error);
    throw error;
  }
};

// Get media file details
export const getMediaById = async (id: string): Promise<MediaFile> => {
  try {
    const response = await mediaApi.get(`/media/${id}`);
    return response.data.media;
  } catch (error) {
    console.error('Get media details error:', error);
    throw error;
  }
};

// Update media file
export const updateMedia = async (
  id: string,
  tags?: string[],
  customMetadata?: Record<string, any>
): Promise<void> => {
  try {
    const updateData: any = {};
    
    if (tags) {
      updateData.tags = tags.join(',');
    }
    
    if (customMetadata) {
      updateData.customMetadata = JSON.stringify(customMetadata);
    }

    await mediaApi.put(`/media/${id}`, updateData);
  } catch (error) {
    console.error('Update media error:', error);
    throw error;
  }
};

// Get media statistics
export const getMediaStats = async (): Promise<MediaStats> => {
  try {
    const response = await mediaApi.get('/media/stats');
    return response.data.stats;
  } catch (error) {
    console.error('Get media stats error:', error);
    throw error;
  }
};

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'document';
};

export const getFileIcon = (format: string): string => {
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const audioFormats = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
  const documentFormats = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  
  if (imageFormats.includes(format.toLowerCase())) return '🖼️';
  if (videoFormats.includes(format.toLowerCase())) return '🎥';
  if (audioFormats.includes(format.toLowerCase())) return '🎵';
  if (documentFormats.includes(format.toLowerCase())) return '📄';
  
  return '📁';
};

export default mediaApi;
