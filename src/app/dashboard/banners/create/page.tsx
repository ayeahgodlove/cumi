"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { IMedia } from "@domain/models/media.model";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Image, Input, Select, Space, Typography } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { queryResult: mediaData, selectProps: mediaSelectProps } =
    useSelect<IMedia>({
      resource: "media",
    });

  const media = mediaData.data;
  return (
    <>
      <PageBreadCrumbs items={["Banners", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
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
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name={"subTitle"}
            label="Description"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea size="large" />
          </Form.Item>
          <Form.Item
            name={"image"}
            label="Image"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Select
              {...mediaSelectProps}
              showSearch
              options={
                media
                  ? media.data.map((d) => {
                      return {
                        label: d.title,
                        value: d.imageUrl,
                        emoji: (
                          <Image
                            src={`${BASE_URL_UPLOADS_MEDIA}/${d.imageUrl}`}
                            alt={d?.title}
                            height={50}
                            width={60}
                          />
                        ),
                        desc: (
                          <Typography.Title level={5}>
                            {d.title}
                          </Typography.Title>
                        ),
                      };
                    })
                  : []
              }
              optionRender={(option) => (
                <Space>
                  <span role="img" aria-label={option.data.label}>
                    {option.data.emoji}
                  </span>
                  {option.data.desc}
                </Space>
              )}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select image"
              size="large"
            />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
