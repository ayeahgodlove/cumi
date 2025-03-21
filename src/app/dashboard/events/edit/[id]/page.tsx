"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { IMedia } from "@domain/models/media.model";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  Row,
  Typography,
  DatePicker,
  Select,
  Space,
  Image,
} from "antd";
import dayjs from "dayjs";

export default function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({});
  const { queryResult: mediaData, selectProps: mediaSelectProps } =
    useSelect<IMedia>({
      resource: "media",
    });

  const media = mediaData.data;

  return (
    <>
      <PageBreadCrumbs items={["Events", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form
          {...formProps}
          layout="vertical"
          initialValues={{
            ...formProps.initialValues,
            eventDate: dayjs(formProps.initialValues?.eventDate),
          }}
        >
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
                <DatePicker
                  placeholder="Enter event date"
                  name="eventDate"
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  size="large"
                />
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
              <Form.Item
                name={"imageUrl"}
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
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  placeholder="Select image"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Edit>
    </>
  );
}
