/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { 
  Card, 
  Form, 
  Input, 
  Button, 
  notification, 
  Space, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Switch, 
  Upload, 
  Avatar,
  Tag,
  Badge,
  Tooltip,
  Tabs
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined,
  GlobalOutlined,
  BellOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  SecurityScanOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import { validatePhoneNumber } from "@utils/country-codes";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [preferencesForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [api, contextHolder] = notification.useNotification();

  // Mock user data - in real app, this would come from API
  const [userData, setUserData] = useState({
    username: session?.user?.name || '',
    email: session?.user?.email || '',
    fullName: session?.user?.name || '',
    phoneNumber: '',
    countryCode: 'CM', // Default to Cameroon
    bio: '',
    dateOfBirth: null as Date | null,
    gender: undefined as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined,
    address: '',
    timezone: 'UTC',
    locale: 'en',
    emailNotifications: true,
    smsNotifications: false,
    verified: false,
    accountStatus: 'active' as 'active' | 'inactive' | 'suspended' | 'banned' | 'pending',
    createdAt: new Date(),
    lastLoginAt: new Date(),
  });

  // Load user data from API
  const loadUserData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      const result = await response.json();
      
      if (response.ok && result) {
        const apiUserData = {
          username: result.username || '',
          email: result.email || '',
          fullName: result.fullName || '',
          phoneNumber: result.phoneNumber || '',
          countryCode: result.countryCode || 'CM', // Default to Cameroon
          bio: result.bio || '',
          dateOfBirth: result.dateOfBirth ? new Date(result.dateOfBirth) : null,
          gender: result.gender,
          address: result.address || '',
          timezone: result.timezone || 'UTC',
          locale: result.locale || 'en',
          emailNotifications: result.emailNotifications ?? true,
          smsNotifications: result.smsNotifications ?? false,
          verified: result.verified ?? false,
          accountStatus: result.accountStatus || 'active',
          createdAt: result.createdAt ? new Date(result.createdAt) : new Date(),
          lastLoginAt: result.lastLoginAt ? new Date(result.lastLoginAt) : new Date(),
        };
        
        setUserData(apiUserData);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [session?.user?.id]);

  useEffect(() => {
    // Initialize forms with user data
    profileForm.setFieldsValue({
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      countryCode: userData.countryCode || 'CM',
      bio: userData.bio,
      dateOfBirth: userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
      gender: userData.gender,
      address: userData.address,
    });

    preferencesForm.setFieldsValue({
      timezone: userData.timezone,
      locale: userData.locale,
      emailNotifications: userData.emailNotifications,
      smsNotifications: userData.smsNotifications,
    });
    
    // Log for debugging
    console.log('Settings form initialized with countryCode:', userData.countryCode || 'CM');
  }, [userData, profileForm, preferencesForm]);

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      const updateData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toDate().toISOString() : null,
      };

      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      // Update local state
      const updatedData = {
        ...userData,
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toDate() : null,
      };
      
      setUserData(updatedData);
      api.success({
        message: "Profile Updated!",
        description: "Profile updated successfully!",
        placement: 'topRight',
        duration: 3,
      });
      
      // Update the session if needed
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.fullName,
          email: values.email,
        },
      });
    } catch (error: any) {
      api.error({
        message: "Update Failed",
        description: error.message || "Failed to update profile",
        placement: 'topRight',
      });
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to change password');
      }

      api.success({
        message: "Password Changed!",
        description: "Password changed successfully!",
        placement: 'topRight',
        duration: 3,
      });
      passwordForm.resetFields();
    } catch (error: any) {
      api.error({
        message: "Password Change Failed",
        description: error.message || "Failed to change password",
        placement: 'topRight',
      });
      console.error("Password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update preferences');
      }

      const updatedData = { ...userData, ...values };
      setUserData(updatedData);
      api.success({
        message: "Preferences Updated!",
        description: "Preferences updated successfully!",
        placement: 'topRight',
        duration: 3,
      });
    } catch (error: any) {
      api.error({
        message: "Update Failed",
        description: error.message || "Failed to update preferences",
        placement: 'topRight',
      });
      console.error("Preferences update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'suspended': return 'red';
      case 'banned': return 'red';
      case 'pending': return 'blue';
      default: return 'default';
    }
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          Profile Information
        </span>
      ),
      children: (
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  src={session?.user?.image}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
                />
                <div>
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Button icon={<CameraOutlined />} size="small">
                      Change Photo
                    </Button>
                  </Upload>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Text strong>{userData.fullName}</Text>
                  <br />
                  <Text type="secondary">{userData.email}</Text>
                  <br />
                  <Tag color={getStatusColor(userData.accountStatus)} style={{ marginTop: 8 }}>
                    {userData.accountStatus.toUpperCase()}
                  </Tag>
                  {userData.verified && (
                    <Badge status="success" text="Verified" style={{ marginTop: 8, display: 'block' }} />
                  )}
                </div>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
                size="large"
              >
                {/* Hidden field for country code */}
                <Form.Item name="countryCode" initialValue="CM" hidden>
                  <Input />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[{ required: true, message: "Please enter your username" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your username"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter your full name" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your full name"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter your email address"
                  />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const countryCode = profileForm.getFieldValue('countryCode') || 'CM';
                        console.log('Validating settings phone with country code:', countryCode, 'Phone:', value);
                        if (validatePhoneNumber(countryCode, value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Please enter a valid phone number'));
                      },
                    },
                  ]}
                >
                  <PhoneNumberInput
                    placeholder="Enter your phone number"
                    showMoneyServices={true}
                    countryCode={userData.countryCode || 'CM'}
                    onCountryCodeChange={(code) => {
                      console.log('Settings: Country code changed to:', code);
                      profileForm.setFieldValue('countryCode', code);
                    }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="dateOfBirth"
                      label="Date of Birth"
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Select your date of birth"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="gender"
                      label="Gender"
                    >
                      <Select placeholder="Select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                        <Option value="prefer_not_to_say">Prefer not to say</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="address"
                  label="Address"
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Enter your address"
                  />
                </Form.Item>

                <Form.Item
                  name="bio"
                  label="Bio"
                >
                  <TextArea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          Security
        </span>
      ),
      children: (
        <Card>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            size="large"
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: "Please enter your current password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your current password"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your new password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your new password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LockOutlined />}
                size="large"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'preferences',
      label: (
        <span>
          <BellOutlined />
          Preferences
        </span>
      ),
      children: (
        <Card>
          <Form
            form={preferencesForm}
            layout="vertical"
            onFinish={handleUpdatePreferences}
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="timezone"
                  label="Timezone"
                >
                  <Select placeholder="Select timezone">
                    <Option value="UTC">UTC</Option>
                    <Option value="America/New_York">Eastern Time</Option>
                    <Option value="America/Chicago">Central Time</Option>
                    <Option value="America/Denver">Mountain Time</Option>
                    <Option value="America/Los_Angeles">Pacific Time</Option>
                    <Option value="Europe/London">London</Option>
                    <Option value="Europe/Paris">Paris</Option>
                    <Option value="Asia/Tokyo">Tokyo</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="locale"
                  label="Language"
                >
                  <Select placeholder="Select language">
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                    <Option value="de">German</Option>
                    <Option value="zh">Chinese</Option>
                    <Option value="ja">Japanese</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Notification Preferences</Divider>

            <Form.Item
              name="emailNotifications"
              label="Email Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="smsNotifications"
              label="SMS Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                Update Preferences
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'account',
      label: (
        <span>
          <InfoCircleOutlined />
          Account Information
        </span>
      ),
      children: (
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>User ID:</Text>
                  <br />
                  <Text type="secondary" copyable>{session?.user?.id || "N/A"}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>Role:</Text>
                  <br />
                  <Tag color="blue" style={{ textTransform: "capitalize" }}>
                    {session?.user?.role || "User"}
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>Account Status:</Text>
                  <br />
                  <Tag color={getStatusColor(userData.accountStatus)}>
                    {userData.accountStatus.toUpperCase()}
                  </Tag>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>Email Verified:</Text>
                  <br />
                  <Tag color={userData.verified ? "green" : "red"}>
                    {userData.verified ? "Verified" : "Not Verified"}
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>Member Since:</Text>
                  <br />
                  <Text type="secondary">
                    {userData.createdAt.toLocaleDateString()}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>Last Login:</Text>
                  <br />
                  <Text type="secondary">
                    {userData.lastLoginAt.toLocaleDateString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <PageBreadCrumbs items={["Dashboard", "Settings"]} />
      
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Account Settings
        </Title>
        <Text type="secondary">
          Manage your account settings and preferences
        </Text>
      </div>
      
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
      </div>
    </>
  );
}