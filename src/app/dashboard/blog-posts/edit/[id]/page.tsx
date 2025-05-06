"use client";

import { PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { modules } from "@components/shared/react-quil-config";
import { BASE_URL, BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogPostEdit() {
  const [fileList, setFileList] = useState([]);
  const { formProps, saveButtonProps } = useForm({});

  const { queryResult: categoryData, selectProps: categoryProps } =
    useSelect<ICategory>({
      resource: "categories",
    });
  const { queryResult: tagData, selectProps: tagProps } = useSelect<ITag>({
    resource: "tags",
  });

  const categories = categoryData.data;
  const tags = tagData.data;

  const handleUploadChange = ({
    file,
    fileList,
  }: {
    file: any;
    fileList: any;
  }) => {
    // Update the file list to include only valid statuses
    const filteredList = fileList.filter(
      (f: any) => f.status === "uploading" || f.status === "done"
    );

    if (file.status === "done") {
      message.success(`${file.name} uploaded successfully.`);

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
      }
    } else if (file.status === "error") {
      message.error(`${file.name} upload failed.`);
    }

    setFileList(filteredList);
  };
  return (
    <>
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label={"Title"}
            name={["title"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            style={{ marginBottom: 3 }}
            rules={[
              {
                required: true,
                message: "Description is required",
              },
            ]}
          >
            <Input.TextArea size="large" />
          </Form.Item>

          <Form.Item
            label={"Content"}
            name="content"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <ReactQuill
              modules={modules}
              theme="snow"
              onChange={(html) =>
                formProps.form?.setFieldValue("content", html)
              }
              placeholder="Enter content..."
            />
          </Form.Item>
          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={"Category"}
                name={"categoryId"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  {...categoryProps}
                  showSearch
                  options={
                    categories
                      ? categories.data.map((d) => {
                          return {
                            label: d.name,
                            value: d.id,
                          };
                        })
                      : []
                  }
                  placeholder="Select a related category"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={"Status"}
                name={["status"]}
                initialValue={"draft"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={"draft"}
                  options={[
                    { value: "DRAFT", label: "Draft" },
                    { value: "PUBLISHED", label: "Published" },
                    { value: "REJECTED", label: "Rejected" },
                  ]}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={"Tags"}
            name={["tags"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              {...tagProps}
              showSearch
              options={
                tags
                  ? tags.data.map((d) => {
                      return {
                        label: d.name,
                        value: d.id,
                      };
                    })
                  : []
              }
              mode="tags"
              placeholder="Select related tags"
              size="large"
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="Upload Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => true}
              onChange={handleUploadChange}
              action={`${BASE_URL}${BASE_URL_UPLOADS_MEDIA}`}
              multiple
              showUploadList={{ showPreviewIcon: true }}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
