"use client";

import { PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { useUpload } from "@hooks/shared/upload.hook";
import { Create, useForm } from "@refinedev/antd";
import { upload } from "@utils/upload";
import { Col, DatePicker, Form, Input, Row, Typography, Upload } from "antd";
import { useCallback } from "react";

export default function CategoryCreate() {
  const { formProps, saveButtonProps, form } = useForm({});
  const { fileList, onRemove, beforeUpload, progress, handlePreview } =
    useUpload();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const formData = new FormData();
  return (
    <>
      <PageBreadCrumbs items={["Events", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
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
              const response = await upload("events", formData);
              form.setFieldValue("imageUrl", response);
              return response;
            }, [form, fileList, formData])}
          >
            {fileList.length > 1 ? null : uploadButton}
          </Upload>
        </>
        <Form {...formProps} layout="vertical">
          <Form.Item
            name={"title"}
            label="Title"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"description"}
            label="Description"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea />
          </Form.Item>

          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"eventDate"}
                label="Event Date"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginRight: 10 }}
              >
                {/* <ConfigProvider locale={enUS as any}> */}
                <DatePicker
                  placeholder="Enter event date"
                  name="eventDate"
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                />
                {/* </ConfigProvider> */}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={"location"}
                label="Location"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
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
            </Col>
          </Row>
        </Form>
      </Create>
    </>
  );
}
