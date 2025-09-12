"use client";

import React, { useEffect, useState } from "react";
import { Form, Upload, message, Image } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";

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
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label = "Image",
  required = false,
  maxSize = 1024 * 1024, // 1MB default
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  form,
  fieldName = 'imageUrl',
  initialImageUrl,
  onImageChange,
  className = "",
}) => {
  const [initialImage, setInitialImage] = useState<string>("");

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize,
    allowedTypes,
    form,
    fieldName,
    onSuccess: (response) => {
      // This will be handled in useEffect to prevent setState in render
    },
    onError: (error) => {
      message.error(error);
    }
  });

  // Handle form field updates in useEffect to prevent setState in render
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

  // Initialize fileList with existing image when form data is loaded
  useEffect(() => {
    const currentImageUrl = form?.getFieldValue(fieldName) || initialImageUrl;
    if (currentImageUrl && typeof currentImageUrl === 'string' && currentImageUrl.trim() !== '') {
      setInitialImage(currentImageUrl);
      // Convert existing image URL to fileList format
      const existingFile = {
        uid: '-1',
        name: 'existing-image',
        status: 'done',
        url: currentImageUrl,
        thumbUrl: currentImageUrl,
      };
      setFileList([existingFile]);
    }
  }, [form, fieldName, initialImageUrl, setFileList]);

  const handleRemoveWithCleanup = async (file: any) => {
    // If removing existing file, delete it from server
    if (file.url === initialImage && initialImage) {
      try {
        // Extract filename from URL and delete from server
        const filename = initialImage.split('/').pop();
        if (filename) {
          await fetch(`/api/upload/delete/${filename}`, {
            method: 'DELETE',
          });
        }
      } catch (error) {
        console.error('Error deleting file from server:', error);
      }
    }
    
    // Remove from fileList
    handleRemove(file);
    
    // Clear form field
    form?.setFieldsValue({
      [fieldName]: ''
    });
    onImageChange?.('');
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Form.Item
      name={fieldName}
      label={label}
      rules={[
        ...(required ? [{ required: true, message: `${label} is required` }] : []),
      ]}
      className={className}
    >
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleUploadChange}
        onRemove={handleRemoveWithCleanup}
        beforeUpload={beforeUpload}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          showDownloadIcon: false,
        }}
        previewFile={(file) => {
          if (file.url) {
            return (
              <Image
                src={file.url}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            );
          }
          return null;
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
    </Form.Item>
  );
};

export default ImageUploadField;
