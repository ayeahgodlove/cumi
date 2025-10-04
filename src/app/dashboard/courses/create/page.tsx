"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ICategory } from "@domain/models/category";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, Row, Select, InputNumber, Switch, DatePicker } from "antd";
import ImageUploadField from "@components/shared/image-upload-field.component";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import { validatePhoneNumber } from "@utils/country-codes";

export default function CourseCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData?.data || [];

  return (
    <>
      <PageBreadCrumbs items={["Courses", "Lists", "Create"]} />
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
            <Input.TextArea size="large" rows={3} />
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
                  showSearch
                  onChange={selectProps.onChange}
                  onSearch={selectProps.onSearch}
                  filterOption={selectProps.filterOption}
                  options={
                    Array.isArray(categories)
                      ? categories.map((d: ICategory) => {
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
                name={"authorName"}
                label="Author"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* Course Pricing */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"price"}
                label="Price (XAF)"
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
                label="Free Course"
                valuePropName="checked"
                style={{ marginBottom: 10 }}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"currency"}
                label="Currency"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" defaultValue="XAF">
                  <Select.Option value="XAF">XAF (Central African Franc)</Select.Option>
                  <Select.Option value="USD">USD (US Dollar)</Select.Option>
                  <Select.Option value="EUR">EUR (Euro)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Course Details */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"status"}
                label="Status"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" defaultValue="draft">
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="published">Published</Select.Option>
                  <Select.Option value="archived">Archived</Select.Option>
                  <Select.Option value="suspended">Suspended</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"level"}
                label="Difficulty Level"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" defaultValue="beginner">
                  <Select.Option value="beginner">Beginner</Select.Option>
                  <Select.Option value="intermediate">Intermediate</Select.Option>
                  <Select.Option value="advanced">Advanced</Select.Option>
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
                  <Select.Option value="fulfulde">Fulfulde</Select.Option>
                  <Select.Option value="ewondo">Ewondo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Course Capacity */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={"durationWeeks"}
                label="Duration (Weeks)"
                style={{ marginBottom: 10 }}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="e.g., 4"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"maxStudents"}
                label="Max Students"
                style={{ marginBottom: 10 }}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="e.g., 50"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={"targetAudience"}
                label="Target Audience"
                style={{ marginBottom: 10 }}
              >
                <Select size="large" placeholder="Select target audience">
                  <Select.Option value="students">Students</Select.Option>
                  <Select.Option value="professionals">Professionals</Select.Option>
                  <Select.Option value="entrepreneurs">Entrepreneurs</Select.Option>
                  <Select.Option value="farmers">Farmers</Select.Option>
                  <Select.Option value="teachers">Teachers</Select.Option>
                  <Select.Option value="youth">Youth</Select.Option>
                  <Select.Option value="women">Women</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Course Features */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"certificateAvailable"}
                label="Certificate Available"
                valuePropName="checked"
                style={{ marginBottom: 10 }}
              >
                <Switch size="default" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              {/* Hidden field for country code */}
              <Form.Item name="countryCode" initialValue="CM" hidden>
                <Input />
              </Form.Item>
              
              <Form.Item
                name={"instructorContact"}
                label="Instructor Contact"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const countryCode = formProps.form?.getFieldValue('countryCode') || 'CM';
                      console.log('Validating course create phone with country code:', countryCode, 'Phone:', value);
                      if (validatePhoneNumber(countryCode, value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Please enter a valid phone number"));
                    },
                  },
                ]}
              >
                <PhoneNumberInput
                  placeholder="Enter instructor phone number"
                  showMoneyServices={true}
                  countryCode="CM"
                  onCountryCodeChange={(code) => {
                    console.log('Course Create: Country code changed to:', code);
                    formProps.form?.setFieldValue('countryCode', code);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Course Content */}
          <Form.Item
            name={"prerequisites"}
            label="Prerequisites"
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea
              size="large"
              rows={3}
              placeholder="What students should know before taking this course..."
            />
          </Form.Item>

          <Form.Item
            name={"learningOutcomes"}
            label="Learning Outcomes"
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea
              size="large"
              rows={3}
              placeholder="What students will learn from this course..."
            />
          </Form.Item>

          <ImageUploadField
            name="imageUrl"
            label="Course Image"
            required={true}
            form={formProps.form}
            maxSize={5 * 1024 * 1024}
            dragger={true}
            draggerText="Drag & drop a course image here"
            draggerHint="Support for single upload. Maximum file size: 5MB"
          />
        </Form>
      </Create>
    </>
  );
}
