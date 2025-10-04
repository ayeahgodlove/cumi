"use client";

import React, { useEffect, useState } from "react";
import { Form, Upload, Image } from "antd";
import { PlusOutlined, LoadingOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNotification } from "@refinedev/core";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";

/**
 * ImageUploadField Component
 * 
 * Uploads images to Cloudinary in the "cumi" folder
 * Shows a clear preview of uploaded images
 * Handles deletion from Cloudinary when image is removed
 */

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  form: any;
  fieldName?: string;
  initialImageUrl?: string;
  onImageChange?: (imageUrl: string) => void;
  className?: string;
  listType?: "picture-card" | "picture" | "text";
  dragger?: boolean;
  draggerText?: string;
  draggerHint?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label = "Image",
  required = false,
  maxSize = 5 * 1024 * 1024, // 5MB default (increased from 1MB)
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  form,
  fieldName = 'imageUrl',
  initialImageUrl,
  onImageChange,
  className = "",
  listType = "picture-card",
  dragger = false,
  draggerText = "Click or drag image to upload",
  draggerHint = "Support for single upload. Maximum file size: 5MB",
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const { open } = useNotification();

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize,
    allowedTypes,
    form,
    fieldName,
    onSuccess: (response) => {
      open?.({
        type: "success",
        message: "Upload Successful",
        description: "Image uploaded to Cloudinary (cumi folder) successfully!",
      });
      setUploading(false);
      // Set preview image
      if (response.url) {
        setPreviewImage(response.url);
      }
    },
    onError: (error) => {
      open?.({
        type: "error",
        message: "Upload Failed",
        description: error || "Failed to upload image to Cloudinary",
      });
      setUploading(false);
    }
  });

  // Handle form field updates when fileList changes
  useEffect(() => {
    if (fileList && fileList.length > 0) {
      const imageUrl = getImageUrlString(fileList);
      if (imageUrl) {
        form?.setFieldsValue({
          [fieldName]: imageUrl
        });
        onImageChange?.(imageUrl);
      }
    }
  }, [fileList, form, fieldName, onImageChange]);

  // Initialize fileList with existing image (from Cloudinary or elsewhere)
  useEffect(() => {
    const currentImageUrl = form?.getFieldValue(fieldName) || initialImageUrl;
    if (currentImageUrl && typeof currentImageUrl === 'string' && currentImageUrl.trim() !== '') {
      // Convert existing image URL to fileList format for preview
      const existingFile = {
        uid: '-1',
        name: currentImageUrl.split('/').pop() || 'image',
        status: 'done' as const,
        url: currentImageUrl,
        thumbUrl: currentImageUrl,
      };
      setFileList([existingFile]);
      setPreviewImage(currentImageUrl);
    }
  }, [form, fieldName, initialImageUrl, setFileList]);

  const handleRemoveWithCleanup = async (file: any) => {
    // If removing existing file, try to delete it from Cloudinary
    if (file.url || file.response?.url) {
      const urlToDelete = file.url || file.response?.url;
      const publicId = file.response?.publicId || file.publicId;
      
      try {
        // Delete from Cloudinary (non-blocking, best effort)
        const deleteResponse = await fetch('/api/cloudinary/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            publicId: publicId,
            fileUrl: urlToDelete 
          }),
        });

        if (deleteResponse.ok) {
          open?.({
            type: "success",
            message: "Delete Successful",
            description: "Image removed from Cloudinary (cumi folder)",
          });
        }
      } catch (error) {
        // Silently fail - file will remain in Cloudinary but won't be referenced
      }
    }
    
    // Always remove from fileList regardless of delete success
    handleRemove(file);
    
    // Clear form field and preview
    form?.setFieldsValue({
      [fieldName]: ''
    });
    setPreviewImage('');
    onImageChange?.('');
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </div>
    </div>
  );

  const customHandleUploadChange = (info: any) => {
    const { file } = info;
    
    if (file.status === 'uploading') {
      setUploading(true);
    }
    
    if (file.status === 'done') {
      setUploading(false);
      if (file.response?.url) {
        setPreviewImage(file.response.url);
      }
    }
    
    if (file.status === 'error') {
      setUploading(false);
    }
    
    // Call the original handler
    handleUploadChange(info);
  };

  // Render image preview with actions
  const renderImagePreview = () => {
    if (!previewImage) return null;

    return (
      <div style={{ 
        position: 'relative', 
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#fafafa'
      }}>
        <Image
          src={previewImage}
          alt="Uploaded image preview"
          style={{ 
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
          preview={{
            mask: (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <EyeOutlined style={{ fontSize: '20px' }} />
                <span>Preview</span>
              </div>
            )
          }}
        />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '8px'
        }}>
          <div
            onClick={() => {
              const file = fileList[0];
              if (file) {
                handleRemoveWithCleanup(file);
              }
            }}
            style={{
              background: 'rgba(255, 77, 79, 0.8)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <DeleteOutlined />
            <span style={{ fontSize: '12px' }}>Remove</span>
          </div>
        </div>
        <div style={{
          padding: '8px 12px',
          background: 'white',
          borderTop: '1px solid #f0f0f0',
          fontSize: '12px',
          color: '#666'
        }}>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>Cloudinary (cumi folder)</div>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {previewImage}
          </div>
        </div>
      </div>
    );
  };

  // Render dragger or regular upload
  if (dragger) {
    return (
      <Form.Item
        name={fieldName}
        label={label}
        rules={[
          ...(required ? [{ required: true, message: `${label} is required` }] : []),
        ]}
        className={className}
      >
        {previewImage ? (
          renderImagePreview()
        ) : (
          <Upload.Dragger
            name="file"
            action="/api/uploads"
            listType={listType}
            fileList={fileList}
            onChange={customHandleUploadChange}
            onRemove={handleRemoveWithCleanup}
            beforeUpload={beforeUpload}
            maxCount={1}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              {uploading ? <LoadingOutlined style={{ fontSize: 48 }} /> : <PlusOutlined style={{ fontSize: 48 }} />}
            </p>
            <p className="ant-upload-text">{draggerText}</p>
            <p className="ant-upload-hint">{draggerHint}</p>
          </Upload.Dragger>
        )}
      </Form.Item>
    );
  }

  return (
    <Form.Item
      name={fieldName}
      label={label}
      rules={[
        ...(required ? [{ required: true, message: `${label} is required` }] : []),
      ]}
      className={className}
    >
      {previewImage ? (
        renderImagePreview()
      ) : (
        <Upload
          name="file"
          action="/api/uploads"
          listType={listType}
          fileList={fileList}
          onChange={customHandleUploadChange}
          onRemove={handleRemoveWithCleanup}
          beforeUpload={beforeUpload}
          maxCount={1}
          showUploadList={false}
        >
          {uploadButton}
        </Upload>
      )}
    </Form.Item>
  );
};

export default ImageUploadField;
