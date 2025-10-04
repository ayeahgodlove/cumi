"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Table, 
  message, 
  Modal, 
  Space, 
  Tag, 
  Typography, 
  Row, 
  Col,
  Divider,
  Spin,
  Alert
} from "antd";
import { 
  MailOutlined, 
  SendOutlined, 
  UserOutlined, 
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  accountStatus: string;
  createdAt: string;
}

interface EmailResult {
  recipient: string;
  success: boolean;
  result?: any;
  error?: string;
}

export default function MailingListPage() {
  const [form] = Form.useForm();
  const [mailingList, setMailingList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>([]);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);

  useEffect(() => {
    loadMailingList();
  }, []);

  const loadMailingList = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/mailing-list');
      const data = await response.json();
      
      if (response.ok) {
        setMailingList(data.mailingList);
      } else {
        message.error(data.error || 'Failed to load mailing list');
      }
    } catch (error) {
      message.error('Failed to load mailing list');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (values: any) => {
    setSending(true);
    try {
      const response = await fetch('/api/admin/mailing-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success(`Email sent to ${data.successCount} recipients successfully`);
        setEmailResults(data.results);
        setResultsModalVisible(true);
        form.resetFields();
      } else {
        message.error(data.error || 'Failed to send email');
      }
    } catch (error) {
      message.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();
    if (!values.subject || !values.html) {
      message.warning('Please fill in subject and content before previewing');
      return;
    }
    setPreviewModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: User) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const getRecipientCount = (recipientType: string, recipientIds: string[]) => {
    if (recipientType === 'all') {
      return mailingList.length;
    } else if (recipientType === 'specific') {
      return recipientIds?.length || 0;
    }
    return 0;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <MailOutlined /> Mailing List Management
      </Title>
      
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="Compose Email" style={{ marginBottom: 24 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSendEmail}
              initialValues={{
                recipientType: 'all'
              }}
            >
              <Form.Item
                name="recipientType"
                label="Recipients"
                rules={[{ required: true, message: 'Please select recipients' }]}
              >
                <Select placeholder="Select recipients">
                  <Option value="all">
                    <Space>
                      <TeamOutlined />
                      All Users ({mailingList.length})
                    </Space>
                  </Option>
                  <Option value="specific">
                    <Space>
                      <UserOutlined />
                      Specific Users
                    </Space>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => 
                  prevValues.recipientType !== currentValues.recipientType
                }
              >
                {({ getFieldValue }) => {
                  const recipientType = getFieldValue('recipientType');
                  
                  if (recipientType === 'specific') {
                    return (
                      <Form.Item
                        name="recipientIds"
                        label="Select Users"
                        rules={[{ required: true, message: 'Please select users' }]}
                      >
                        <Select
                          mode="multiple"
                          placeholder="Select users to send email to"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {mailingList.map(user => (
                            <Option key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    );
                  }
                  return null;
                }}
              </Form.Item>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter email subject' }]}
              >
                <Input placeholder="Enter email subject" />
              </Form.Item>

              <Form.Item
                name="html"
                label="Email Content (HTML)"
                rules={[{ required: true, message: 'Please enter email content' }]}
              >
                <TextArea
                  rows={8}
                  placeholder="Enter HTML email content..."
                />
              </Form.Item>

              <Form.Item
                name="text"
                label="Plain Text Version"
                rules={[{ required: true, message: 'Please enter plain text version' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter plain text version..."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    loading={sending}
                    disabled={sending}
                  >
                    Send Email
                  </Button>
                  <Button 
                    onClick={handlePreview}
                    icon={<MailOutlined />}
                  >
                    Preview
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Mailing List Statistics">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Total Users:</Text> {mailingList.length}
              </div>
              <div>
                <Text strong>Active Users:</Text> {mailingList.filter(u => u.accountStatus === 'active').length}
              </div>
              <div>
                <Text strong>Admin Users:</Text> {mailingList.filter(u => u.role === 'admin').length}
              </div>
              <Divider />
              <Alert
                message="Email Guidelines"
                description="Make sure your email content is professional and follows best practices for bulk email sending."
                type="info"
                showIcon
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="User List" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={mailingList}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>

      {/* Preview Modal */}
      <Modal
        title="Email Preview"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>
        ]}
        width="95%"
        style={{ maxWidth: '900px' }}
      >
        <div>
          <Title level={4}>Subject: {form.getFieldValue('subject')}</Title>
          <Divider />
          <div 
            dangerouslySetInnerHTML={{ 
              __html: form.getFieldValue('html') || 'No content' 
            }}
            style={{ 
              border: '1px solid #d9d9d9', 
              padding: '16px', 
              borderRadius: '6px',
              backgroundColor: '#fafafa'
            }}
          />
        </div>
      </Modal>

      {/* Results Modal */}
      <Modal
        title="Email Send Results"
        open={resultsModalVisible}
        onCancel={() => setResultsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setResultsModalVisible(false)}>
            Close
          </Button>
        ]}
        width="95%"
        style={{ maxWidth: '900px' }}
      >
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <div>Successful</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                    {emailResults.filter(r => r.success).length}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                  <div>Failed</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}>
                    {emailResults.filter(r => !r.success).length}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div>Total</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                    {emailResults.length}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Table
            dataSource={emailResults}
            columns={[
              {
                title: 'Recipient',
                dataIndex: 'recipient',
                key: 'recipient',
              },
              {
                title: 'Status',
                dataIndex: 'success',
                key: 'success',
                render: (success: boolean) => (
                  <Tag color={success ? 'green' : 'red'}>
                    {success ? 'Success' : 'Failed'}
                  </Tag>
                ),
              },
              {
                title: 'Error',
                dataIndex: 'error',
                key: 'error',
                render: (error: string) => error || '-',
              },
            ]}
            pagination={false}
            size="small"
          />
        </div>
      </Modal>
    </div>
  );
}

