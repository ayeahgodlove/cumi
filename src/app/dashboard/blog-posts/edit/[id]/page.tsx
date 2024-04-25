"use client";

import { PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { modules } from "@components/shared/react-quil-config";
import { useUpload } from "@hooks/shared/upload.hook";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { upload } from "@utils/upload";
import { Form, Input, Select, Typography, Upload } from "antd";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogPostEdit() {
  const { formProps, saveButtonProps, form } = useForm({});
  const { fileList, handlePreview, onRemove, beforeUpload, progress } =
    useUpload();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const { queryResult, selectProps } = useSelect({
    resource: "categories",
  });

  const formData = new FormData();
  const { data } = queryResult;
  return (
    <>
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <>
          <Typography.Title level={5}>Upload Image</Typography.Title>
          <Upload
            name="image"
            maxCount={1}
            listType="picture-card"
            beforeUpload={beforeUpload}
            onRemove={onRemove}
            progress={progress}
            fileList={fileList}
            onPreview={handlePreview}
            action={useCallback(async () => {
              formData.append("imageUrl", fileList[0] as any);
              const response = await upload("posts", formData);
              form.setFieldValue("imageUrl", response);
              return response;
            }, [form, fileList, formData])}
          >
            {fileList.length > 1 ? null : uploadButton}
          </Upload>
        </>
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
            <Input />
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
            <Input.TextArea />
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
            {/* <Input.TextArea rows={5} /> */}
            <ReactQuill
              modules={modules}
              theme="snow"
              onChange={(html) =>
                formProps.form?.setFieldValue("content", html)
              }
              placeholder="Enter content..."
            />
          </Form.Item>
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
              showSearch
              onChange={selectProps.onChange}
              onSearch={selectProps.onSearch}
              filterOption={selectProps.filterOption}
              options={
                data
                  ? data.data.map((d) => {
                      return {
                        label: d.name,
                        value: d.id,
                      };
                    })
                  : []
              }
            />
          </Form.Item>
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
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item
            name={"imageUrl"}
            label="Image"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input disabled={true} />
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
