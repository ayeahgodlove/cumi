import { message } from "antd";
import { useState } from "react";

interface UploadResponse {
  success: boolean;
  message: string;
  url?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  type?: string;
  error?: string;
}

interface UseUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: string) => void;
  form?: any; // Add form reference for direct field updates
  fieldName?: string; // Add field name for direct updates
}

export const useUpload = (options: UseUploadOptions = {}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const {
    maxSize = 1024 * 1024, // 1MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    onSuccess,
    onError,
    form,
    fieldName
  } = options;

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const validationError = validateFile(file);
    if (validationError) {
      const errorResponse = { success: false, message: validationError };
      onError?.(validationError);
      return errorResponse;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        message.success(`${file.name} uploaded successfully`);
        onSuccess?.(result);
      } else {
        message.error(result.message || 'Upload failed');
        onError?.(result.message || 'Upload failed');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      message.error(errorMessage);
      onError?.(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  const handleUploadChange = ({ file, fileList }: { file: any; fileList: any }) => {
    // Handle file removal - delete from server if it was uploaded
    if (file.status === 'removed') {
      const fileToRemove = fileList.find((f: any) => f.uid === file.uid);
      if (fileToRemove?.response?.url) {
        deleteUploadedFile(fileToRemove.response.url).catch((error) => {
          console.warn('Failed to delete file from server:', error);
        });
      }
    }

    // Filter out files with error status
    const filteredList = fileList.filter((f: any) => f.status !== 'error');
    
    if (file.status === 'done') {
      const uploadedUrl = file.response?.url;
      if (uploadedUrl) {
        const updatedList = filteredList.map((f: any) => {
          if (f.uid === file.uid) {
            return {
              ...f,
              url: uploadedUrl,
              name: file.name,
              response: { url: uploadedUrl },
            };
          }
          return f;
        });
        setFileList(updatedList);
        
        // Update form field directly if form and fieldName are provided
        if (form && fieldName) {
          form.setFieldsValue({
            [fieldName]: uploadedUrl
          });
        }
      }
    } else if (file.status === 'error') {
      message.error(`${file.name} upload failed`);
    }

    setFileList(filteredList);
  };

  const beforeUpload = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      message.error(validationError);
      return false;
    }
    return true;
  };

  const removeFile = (file: any) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
  };

  const clearFiles = () => {
    setFileList([]);
  };

  const handleRemove = async (file: any) => {
    // If file was uploaded, delete it from server
    if (file.response?.url) {
      const deleted = await deleteUploadedFile(file.response.url);
      if (deleted) {
        message.success('File deleted successfully');
      } else {
        message.warning('File removed from form but may still exist on server');
      }
    }
    
    // Remove from file list
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    
    return true; // Allow removal
  };

  return {
    uploading,
    fileList,
    setFileList,
    uploadFile,
    handleUploadChange,
    beforeUpload,
    removeFile,
    clearFiles,
    handleRemove,
    validateFile
  };
};

// Utility function to delete uploaded files
export const deleteUploadedFile = async (fileUrl: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/uploads/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Utility function to get file info from URL
export const getFileInfoFromUrl = (url: string) => {
  if (!url) return null;
  
  const filename = url.split('/').pop();
  const extension = filename?.split('.').pop()?.toLowerCase();
  
  return {
    filename,
    extension,
    url,
    isImage: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')
  };
};

// Utility function to extract URL from file list for form submission
export const getImageUrlFromEvent = (e: any) => {
  // Handle different event types
  if (Array.isArray(e)) {
    // If it's an array (fileList), return it as is for form control
    return e;
  }
  
  if (e && typeof e === 'object') {
    // If it's a single file object, wrap it in an array
    if (e.response?.url || e.url) {
      return [e];
    }
  }
  
  // Return empty array if no valid file
  return [];
};

// Utility function to extract URL string from file list for form field updates
export const getImageUrlString = (fileList: any[]): string => {
  if (Array.isArray(fileList) && fileList.length > 0) {
    const file = fileList[0];
    if (file?.response?.url) {
      return file.response.url;
    }
    if (file?.url) {
      return file.url;
    }
  }
  return '';
};