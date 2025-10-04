"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { ITag } from "@domain/models/tag";
import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
  Switch,
} from "antd";

export default function EventCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

  const tags = tagData.data;

  return (
    <>
      <PageBreadCrumbs items={["Events", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form} size="large">
          <Form.Item
            name={"title"}
            label="Title"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input size="large" />
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
            <Input.TextArea size="large" />
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
                  size="large"
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
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <ImageUploadField
                name="imageUrl"
                label="Event Image"
                required={true}
                form={formProps.form}
                maxSize={5 * 1024 * 1024}
              />
            </Col>

            <Col xs={24} md={24}>
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
            </Col>
          </Row>

          {/* Event Details */}
          <Row gutter={[8, 8]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"status"}
                label="Status"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" defaultValue="draft">
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="published">Published</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                  <Select.Option value="completed">Completed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"eventEndDate"}
                label="Event End Date"
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  placeholder="Enter event end date"
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"category"}
                label="Category"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" placeholder="Select category">
                  <Select.Option value="workshop">Workshop</Select.Option>
                  <Select.Option value="seminar">Seminar</Select.Option>
                  <Select.Option value="conference">Conference</Select.Option>
                  <Select.Option value="training">Training</Select.Option>
                  <Select.Option value="meeting">Meeting</Select.Option>
                  <Select.Option value="social">Social</Select.Option>
                  <Select.Option value="religious">Religious</Select.Option>
                  <Select.Option value="cultural">Cultural</Select.Option>
                  <Select.Option value="sports">Sports</Select.Option>
                  <Select.Option value="business">Business</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Event Pricing */}
          <Row gutter={[8, 8]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"entryFee"}
                label="Entry Fee (XAF)"
                style={{ marginBottom: 10 }}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  min={0}
                  precision={2}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"isFree"}
                label="Free Event"
                valuePropName="checked"
                style={{ marginBottom: 10 }}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"maxAttendees"}
                label="Max Attendees"
                style={{ marginBottom: 10 }}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="e.g., 100"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Contact Information */}
          <Row gutter={[8, 8]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"contactPhone"}
                label="Contact Phone"
                style={{ marginBottom: 10 }}
              >
                <Input size="large" placeholder="+237..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"contactEmail"}
                label="Contact Email"
                style={{ marginBottom: 10 }}
              >
                <Input size="large" placeholder="contact@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"whatsappNumber"}
                label="WhatsApp Number"
                style={{ marginBottom: 10 }}
              >
                <Input size="large" placeholder="+237..." />
              </Form.Item>
            </Col>
          </Row>

          {/* Event Details */}
          <Row gutter={[8, 8]}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"targetAudience"}
                label="Target Audience"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" placeholder="Select target audience">
                  <Select.Option value="students">Students</Select.Option>
                  <Select.Option value="professionals">Professionals</Select.Option>
                  <Select.Option value="general_public">General Public</Select.Option>
                  <Select.Option value="youth">Youth</Select.Option>
                  <Select.Option value="women">Women</Select.Option>
                  <Select.Option value="entrepreneurs">Entrepreneurs</Select.Option>
                  <Select.Option value="farmers">Farmers</Select.Option>
                  <Select.Option value="teachers">Teachers</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"language"}
                label="Language"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" defaultValue="both">
                  <Select.Option value="french">French</Select.Option>
                  <Select.Option value="english">English</Select.Option>
                  <Select.Option value="both">Both</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"region"}
                label="Region"
                style={{ marginBottom: 10 }}
              >
                <Input size="large" placeholder="e.g., Centre, Littoral" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"city"}
                label="City"
                style={{ marginBottom: 10 }}
              >
                <Input size="large" placeholder="City name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={"registrationRequired"}
                label="Registration Required"
                valuePropName="checked"
                style={{ marginBottom: 10 }}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"registrationDeadline"}
                label="Registration Deadline"
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  placeholder="Enter registration deadline"
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={"requirements"}
                label="Requirements"
                style={{ marginBottom: 10 }}
              >
                <Input.TextArea
                  size="large"
                  rows={3}
                  placeholder="Special requirements or items to bring..."
                />
              </Form.Item>
            </Col>
          </Row>

          <ImageUploadField
            name="imageUrl"
            label="Event Image"
            required={true}
            form={formProps.form}
            maxSize={5 * 1024 * 1024}
          />
        </Form>
      </Create>
    </>
  );
}

