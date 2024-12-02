import { configStoreProps } from "@/hooks/configStore";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Tooltip } from "antd";

export type SettingFormProps = {
  initialValues: configStoreProps;
};

export default function SettingForm({ initialValues }: SettingFormProps) {
  const onFinish = (values: configStoreProps) => {
    console.log(values);
  };

  return (
    <Form layout={"vertical"} initialValues={initialValues} onFinish={onFinish} autoComplete="off">
      <Form.Item<configStoreProps>
        label="Meican Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item<configStoreProps>
        label="Meican Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Flex gap={12} align="center" justify="flex-end">
          <Tooltip title="test connection with meican">
            <Button type="default" htmlType="button">
              Test Connection
            </Button>
          </Tooltip>
          <Tooltip title="save your config locally">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Tooltip>
        </Flex>
      </Form.Item>
    </Form>
  );
}
