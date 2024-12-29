import { UploadFile, message, GetProp, UploadProps } from "antd";
import { useState } from "react";

export const useUpload = () => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileInfo, setFileInfo] = useState<any>(null);

  const progress = {
    strokeColor: {
      "0%": "#108ee9",
      "100%": "#87d068",
    },
    strokeWidth: 3,
    format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
  };

  const onRemove = (file: UploadFile<any>) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item: any) => item.uid !== file.uid)
    );
  };
  const beforeUpload = (file: UploadFile<any>) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const fileSize = file.size as number;
    if (fileSize > maxSize) {
      message.error("File must be smaller than 2MB");
      return false;
    }
    setFileList((prevFileList) => [...prevFileList, file]);
    return true;
  };

  const onChangeUpload = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      if (info.fileList.length > 0) {
        const file = info.fileList[0];
        const { name, type, size } = file;
        setFileInfo({ name, type, size });
      } else {
        setFileInfo(null);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  return {
    fileList,
    progress,
    onChangeUpload,
    beforeUpload,
    onRemove,
    handlePreview,
    previewImage,
    previewOpen,
    previewTitle,
    handleCancel,
    fileInfo,
  };
};
