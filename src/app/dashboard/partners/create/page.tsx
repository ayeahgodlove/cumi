"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Row, Col } from "antd";

export default function PartnerCreate() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <>
      <PageBreadCrumbs items={["Partners", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter partner name" }]}
              >
                <Input size="large" placeholder="Enter partner name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input size="large" placeholder="e.g., Bamenda, Cameroon" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea 
              size="large"
              rows={4} 
              placeholder="Tell us about this partner..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Phone"
                name="contactPhone"
                rules={[{ required: true, message: "Please enter contact phone" }]}
              >
                <Input size="large" placeholder="+237681289411" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Website Link"
                name="websiteLink"
                rules={[
                  { required: true, message: "Please enter website link" },
                  { type: "url", message: "Please enter a valid URL" }
                ]}
              >
                <Input size="large" placeholder="https://partner-website.com" />
              </Form.Item>
            </Col>
          </Row>

          <ImageUploadField
            name="logo"
            label="Partner Logo"
            required={true}
            form={formProps.form}
            maxSize={5 * 1024 * 1024}
          />
        </Form>
      </Create>
    </>
  );
}
