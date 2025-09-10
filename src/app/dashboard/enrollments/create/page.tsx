"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ICourse } from "@domain/models/course";
import { IUser } from "@domain/models/user";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";

export default function EnrollmentCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { queryResult: courseData, selectProps: courseSelectProps } =
    useSelect<ICourse>({
      resource: "courses",
    });

  const { queryResult: userData, selectProps: userSelectProps } =
    useSelect<IUser>({
      resource: "users",
    });

  const courses = courseData?.data || [];
  const users = userData?.data || [];

  return (
    <>
      <PageBreadCrumbs items={["Enrollments", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={"User"}
                name={"userId"}
                rules={[
                  {
                    required: true,
                    message: "Please select a user",
                  },
                ]}
              >
                <Select
                  {...userSelectProps}
                  showSearch
                  placeholder="Select a user"
                  size="large"
                  options={
                    Array.isArray(users)
                      ? users.map((d: IUser) => ({
                          label: d.name || d.email,
                          value: d.id,
                        }))
                      : []
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={"Course"}
                name={"courseId"}
                rules={[
                  {
                    required: true,
                    message: "Please select a course",
                  },
                ]}
              >
                <Select
                  {...courseSelectProps}
                  showSearch
                  placeholder="Select a course"
                  size="large"
                  options={
                    Array.isArray(courses)
                      ? courses.map((d: ICourse) => ({
                          label: d.title,
                          value: d.id,
                        }))
                      : []
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"enrollmentDate"}
                label="Enrollment Date"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginBottom: 10 }}
                initialValue={dayjs()}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name={"completionDate"}
                label="Completion Date"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>
    </>
  );
}
