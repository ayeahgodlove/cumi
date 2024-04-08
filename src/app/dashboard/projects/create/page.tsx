"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useUpload } from "@hooks/shared/upload.hook";
import { Create, useForm, getValueFromEvent  } from "@refinedev/antd";
import { Col, Form, Input, Row, Upload  } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const {
    fileList,
    onChangeUpload,
    onRemove,
    beforeUpload,
    progress,
    handlePreview,
    fileInfo
  } = useUpload();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={getValueFromEvent}
          label="Upload"
          style={{ marginBottom: 15 }}
          rules={[
            {
              required: true,
              message: "Upload is required",
            },
          ]}
        >
          <>
            <Upload.Dragger
              maxCount={1}
              action={"http:localhost:8000/uploads/projects"}
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={onChangeUpload}
              onRemove={onRemove}
              progress={progress}
              fileList={fileInfo}
              onPreview={handlePreview}
              style={{ width: "200px"}}
            >
              {fileList.length > 1 ? null : uploadButton}
            </Upload.Dragger>
          </>
        </Form.Item>
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
        <Row gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Form.Item
              name={"githubUrl"}
              label="Github Url"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
            >
              <Input type="website" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name={"deployUrl"}
              label="Deploy Url"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
            >
              <Input type="website" />
            </Form.Item>
          </Col>
        </Row>
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
      </Form>
    </Create>
  );
}
