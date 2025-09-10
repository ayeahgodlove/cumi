"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { Edit, useForm } from "@refinedev/antd";
import {
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

export default function OpportunityEdit() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
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
            label={"Requirements"}
            name="requirements"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <RichTextEditor
              value={formProps.form?.getFieldValue("requirements")}
              onChange={(html) =>
                formProps.form?.setFieldValue("requirements", html)
              }
              placeholder="Enter requirements..."
              height={300}
            />
          </Form.Item>
          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"deadline"}
                label="Deadline"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginRight: 10 }}
              >
                <DatePicker
                  placeholder="Enter deadline"
                  name="deadline"
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={"Type"}
                name={["type"]}
                initialValue={"Jobs"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={"Jobs"}
                  options={[
                    { value: "JOBS", label: "Jobs" },
                    { value: "SCHOLARSHIPS", label: "Scholarships" },
                  ]}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"companyOrInstitution"}
                label="Company / Institution"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginRight: 10 }}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={"Contact Email"}
                name={["contactEmail"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"applicationLink"}
                label="Application Link"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginRight: 10 }}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={"Location"}
                name={["location"]}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Edit>
    </>
  );
}
