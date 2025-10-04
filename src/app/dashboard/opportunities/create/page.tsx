"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { Create, useForm } from "@refinedev/antd";
import { Col, DatePicker, Form, Input, Row, Select, Switch, InputNumber, Divider } from "antd";
import { useState } from "react";

export default function OpportunityCreate() {
  const { formProps, saveButtonProps } = useForm({
    onMutationSuccess: (data, variables, context) => {
      // Success
    },
  });
  const [opportunityType, setOpportunityType] = useState<string>("job");
  const [skills, setSkills] = useState<string[]>([]);

  return (
    <>
      <PageBreadCrumbs items={["Opportunities", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form} size="large">
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
                name={["opp_type"]}
                initialValue={"job"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={"job"}
                  onChange={(value) => setOpportunityType(value)}
                  options={[
                    { value: "job", label: "Job" },
                    { value: "scholarship", label: "Scholarship" },
                    { value: "internship", label: "Internship" },
                    { value: "fellowship", label: "Fellowship" },
                    { value: "grant", label: "Grant" },
                    { value: "other", label: "Other" },
                  ]}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"duration"}
                label="Duration"
                tooltip="e.g., 6 months, 1 year, Full-time"
              >
                <Input placeholder="Enter duration" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name={"amount"}
                label={opportunityType === "job" ? "Salary Range" : "Amount/Value"}
                tooltip={opportunityType === "job" ? "e.g., $50,000 - $80,000" : "e.g., $10,000, Full tuition"}
              >
                <Input placeholder={opportunityType === "job" ? "Enter salary range" : "Enter amount"} size="large" />
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

          {/* Scholarship-specific fields */}
          {(opportunityType === "scholarship" || opportunityType === "fellowship" || opportunityType === "grant") && (
            <>
              <Divider orientation="left" style={{ color: '#22C55E', borderColor: '#22C55E', fontSize: '16px', fontWeight: 600 }}>
                Scholarship/Fellowship Details
              </Divider>
              <Row gutter={[8, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={"academicLevel"}
                    label="Academic Level"
                  >
                    <Select
                      placeholder="Select academic level"
                      options={[
                        { value: "High School", label: "High School" },
                        { value: "Undergraduate", label: "Undergraduate" },
                        { value: "Graduate", label: "Graduate (Master's)" },
                        { value: "PhD", label: "PhD/Doctorate" },
                        { value: "Postdoctoral", label: "Postdoctoral" },
                        { value: "Any", label: "Any Level" },
                      ]}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name={"fieldOfStudy"}
                    label="Field of Study"
                  >
                    <Input placeholder="e.g., Computer Science, Engineering" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={"nationality"}
                    label="Nationality Requirements"
                  >
                    <Input placeholder="e.g., Any nationality, EU citizens only" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name={"ageLimit"}
                    label="Age Limit"
                  >
                    <InputNumber 
                      placeholder="Enter age limit" 
                      min={16}
                      max={100}
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {/* Job-specific fields */}
          {(opportunityType === "job" || opportunityType === "internship") && (
            <>
              <Divider orientation="left" style={{ color: '#0EA5E9', borderColor: '#0EA5E9', fontSize: '16px', fontWeight: 600 }}>
                Job/Internship Details
              </Divider>
              <Row gutter={[8, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={"salaryRange"}
                    label="Salary Range"
                  >
                    <Input placeholder="e.g., $50,000 - $80,000 per year" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name={"employmentType"}
                    label="Employment Type"
                  >
                    <Select
                      placeholder="Select employment type"
                      options={[
                        { value: "Full-time", label: "Full-time" },
                        { value: "Part-time", label: "Part-time" },
                        { value: "Contract", label: "Contract" },
                        { value: "Temporary", label: "Temporary" },
                        { value: "Internship", label: "Internship" },
                        { value: "Freelance", label: "Freelance" },
                      ]}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={"experienceLevel"}
                    label="Experience Level"
                  >
                    <Select
                      placeholder="Select experience level"
                      options={[
                        { value: "Entry Level", label: "Entry Level" },
                        { value: "Mid Level", label: "Mid Level" },
                        { value: "Senior Level", label: "Senior Level" },
                        { value: "Executive", label: "Executive" },
                        { value: "Intern", label: "Intern" },
                      ]}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name={"department"}
                    label="Department"
                  >
                    <Input placeholder="e.g., Engineering, Marketing, Sales" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={"isRemote"}
                    label="Remote Work"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name={"skills"}
                    label="Required Skills"
                    tooltip="Enter skills separated by commas"
                  >
                    <Select
                      mode="tags"
                      placeholder="Type skills and press Enter"
                      size="large"
                      onChange={(value) => setSkills(value)}
                      value={skills}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Divider />

          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"isActive"}
                label="Active Status"
                valuePropName="checked"
                initialValue={true}
                tooltip="Make this opportunity visible to users"
              >
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <ImageUploadField
                name="imageUrl"
                label="Featured Image (Optional)"
                form={formProps.form}
                initialImageUrl={formProps.form?.getFieldValue("imageUrl")}
              />
            </Col>
          </Row>
        </Form>
      </Create>
    </>
  );
}
