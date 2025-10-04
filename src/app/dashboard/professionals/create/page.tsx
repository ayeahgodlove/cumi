"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Row, Col, InputNumber } from "antd";

export default function ProfessionalCreate() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter professional title" }]}
              >
                <Input size="large" placeholder="e.g., Senior Developer" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[{ required: true, message: "Please enter position" }]}
              >
                <Input size="large" placeholder="e.g., Full Stack Developer" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input size="large" placeholder="professional@company.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="WhatsApp Contact"
                name="whatsappContact"
                rules={[{ required: true, message: "Please enter WhatsApp contact" }]}
              >
                <Input size="large" placeholder="+237681289411" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input size="large" placeholder="e.g., Bamenda, Cameroon" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Years of Experience"
                name="yearsOfExperience"
                rules={[{ required: true, message: "Please enter years of experience" }]}
              >
                <InputNumber size="large" min={0} max={50} placeholder="5" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Bio"
            name="bio"
            rules={[{ required: true, message: "Please enter bio" }]}
          >
            <Input.TextArea 
              size="large"
              rows={4} 
              placeholder="Tell us about this professional's background and expertise..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="LinkedIn"
                name={["socialLinks", "linkedin"]}
              >
                <Input size="large" placeholder="https://linkedin.com/in/username" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="GitHub"
                name={["socialLinks", "github"]}
              >
                <Input size="large" placeholder="https://github.com/username" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Website"
                name={["socialLinks", "website"]}
              >
                <Input size="large" placeholder="https://website.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Skills"
            name="skills"
            rules={[{ required: true, message: "Please select skills" }]}
          >
            <Select
              size="large"
              mode="multiple"
              placeholder="Select professional skills"
              options={[
                { label: "React", value: "React" },
                { label: "Laravel", value: "Laravel" },
                { label: "Node.js", value: "Node.js" },
                { label: "TypeScript", value: "TypeScript" },
                { label: "PHP", value: "PHP" },
                { label: "JavaScript", value: "JavaScript" },
                { label: "Python", value: "Python" },
                { label: "Java", value: "Java" },
                { label: "C++", value: "C++" },
                { label: "Vue.js", value: "Vue.js" },
                { label: "Angular", value: "Angular" },
                { label: "MongoDB", value: "MongoDB" },
                { label: "PostgreSQL", value: "PostgreSQL" },
                { label: "MySQL", value: "MySQL" },
                { label: "Docker", value: "Docker" },
                { label: "AWS", value: "AWS" },
                { label: "Git", value: "Git" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Specializations"
            name="specializations"
          >
            <Select
              size="large"
              mode="multiple"
              placeholder="Select specializations"
              options={[
                { label: "Web Development", value: "Web Development" },
                { label: "Mobile Development", value: "Mobile Development" },
                { label: "Backend Development", value: "Backend Development" },
                { label: "Frontend Development", value: "Frontend Development" },
                { label: "DevOps", value: "DevOps" },
                { label: "UI/UX Design", value: "UI/UX Design" },
                { label: "Data Science", value: "Data Science" },
                { label: "Machine Learning", value: "Machine Learning" },
                { label: "Cloud Computing", value: "Cloud Computing" },
                { label: "Cybersecurity", value: "Cybersecurity" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Project Types"
            name="projectTypes"
          >
            <Select
              size="large"
              mode="multiple"
              placeholder="Select project types"
              options={[
                { label: "Web Development", value: "Web Development" },
                { label: "Mobile Apps", value: "Mobile Apps" },
                { label: "E-commerce", value: "E-commerce" },
                { label: "CMS Development", value: "CMS Development" },
                { label: "API Development", value: "API Development" },
                { label: "Database Design", value: "Database Design" },
                { label: "DevOps", value: "DevOps" },
                { label: "UI/UX Design", value: "UI/UX Design" },
                { label: "Consulting", value: "Consulting" },
                { label: "Training", value: "Training" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Languages"
            name="languages"
          >
            <Select
              size="large"
              mode="multiple"
              placeholder="Select languages spoken"
              options={[
                { label: "English", value: "English" },
                { label: "French", value: "French" },
                { label: "Spanish", value: "Spanish" },
                { label: "German", value: "German" },
                { label: "Chinese", value: "Chinese" },
                { label: "Arabic", value: "Arabic" },
                { label: "Portuguese", value: "Portuguese" },
                { label: "Russian", value: "Russian" },
                { label: "Japanese", value: "Japanese" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Certifications"
            name="certifications"
          >
            <Select
              size="large"
              mode="tags"
              placeholder="Add certifications (press Enter to add)"
              options={[
                { label: "AWS Certified Solutions Architect", value: "AWS Certified Solutions Architect" },
                { label: "Google Cloud Professional", value: "Google Cloud Professional" },
                { label: "Microsoft Certified: Azure", value: "Microsoft Certified: Azure" },
                { label: "Certified ScrumMaster", value: "Certified ScrumMaster" },
                { label: "PMP Certification", value: "PMP Certification" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Availability"
            name="availability"
            initialValue="Available"
          >
            <Select
              size="large"
              options={[
                { label: "Available", value: "Available" },
                { label: "Busy", value: "Busy" },
                { label: "Not Available", value: "Not Available" }
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Hourly Rate ($)"
                name="hourlyRate"
              >
                <InputNumber size="large" min={0} placeholder="50" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Education"
                name="education"
              >
                <Input size="large" placeholder="e.g., BSc Computer Science" />
              </Form.Item>
            </Col>
          </Row>

          <ImageUploadField
            name="profileImage"
            label="Profile Image"
            required={true}
            form={formProps.form}
            maxSize={5 * 1024 * 1024}
          />

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Verified Status"
                name="isVerified"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Active Status"
                name="isActive"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>
    </>
  );
}

