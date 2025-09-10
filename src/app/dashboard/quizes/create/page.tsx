"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Button, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function QuizCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lessonId');

  // Pre-populate lessonId if provided in URL
  useEffect(() => {
    if (lessonId && formProps.form) {
      formProps.form.setFieldsValue({
        lessonId: lessonId
      });
    }
  }, [lessonId, formProps.form]);

  return (
    <>
      <PageBreadCrumbs items={["Quizes", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          <Form.Item
            name="lessonId"
            label="Lesson ID"
            style={{ marginBottom: 3 }}
            rules={[
              {
                required: true,
                message: "Lesson ID is required",
              },
            ]}
          >
            <Input size="large" placeholder="Lesson ID" />
          </Form.Item>

          <Form.Item
            name="question"
            label="Question"
            style={{ marginBottom: 3 }}
            rules={[
              {
                required: true,
                message: "Question is required",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.List
            name="answers"
            rules={[
              {
                validator: async (_, answers) => {
                  if (!answers || answers.length < 3) {
                    return Promise.reject(new Error("At least 3 answers"));
                  } else {
                    return Promise.resolve(); // Resolve the Promise when validation passes
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? "Answers" : ""}
                    required={false}
                    key={field.key}
                    style={{ marginBottom: 10 }}
                  >
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Please input answer or delete this field.",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input size="large" placeholder="answer" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <div style={{ marginLeft: 5 }}>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                            style={{ fontSize: 20, opacity: 0.6 }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </Form.Item>
                ))}
                <Form.Item style={{ marginBottom: 15 }}>
                  <Button
                    size="large"
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="correctAnswerIndex"
            label="Correct Answer Index"
            style={{ marginBottom: 10 }}
            rules={[
              {
                required: true,
                message: "Correct Answer Index is required",
              },
            ]}
          >
            <InputNumber
              size="large"
              name="correctAnswerIndex"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
