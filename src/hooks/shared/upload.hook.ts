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
  form?: any;
  fieldName?: string;
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
      onError?.(`${file.name} upload failed`);
    }

    setFileList(filteredList);
  };

  const beforeUpload = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError?.(validationError);
      return false;
    }
    return true;
  };

  const handleRemove = async (file: any) => {
    // Remove from file list
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    return true;
  };

  return {
    uploading,
    fileList,
    setFileList,
    handleUploadChange,
    beforeUpload,
    handleRemove,
    validateFile
  };
};

// Utility function to delete uploaded files from Cloudinary
export const deleteUploadedFile = async (fileUrl: string, publicId?: string): Promise<boolean> => {
  try {
    // Extract public ID from URL if not provided
    let cloudinaryPublicId = publicId;
    
    if (!cloudinaryPublicId && fileUrl) {
      // Extract from Cloudinary URL format
      // https://res.cloudinary.com/dch9sc7gq/image/upload/v1234567890/cumi/image_name.jpg
      const match = fileUrl.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg)$/i);
      if (match && match[1]) {
        cloudinaryPublicId = match[1];
      }
    }

    if (!cloudinaryPublicId) {
      console.warn('No public ID available for deletion');
      return false;
    }

    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId: cloudinaryPublicId }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
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
