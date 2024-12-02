import { configStoreProps } from "@/hooks/configStore";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

export type SettingFormProps = {
  initialValues: configStoreProps;
};

export default function SettingForm({ initialValues }: SettingFormProps) {
  const onFinish = (values: configStoreProps) => {
    console.log(values);
  };

  const { t } = useTranslation();

  return (
    <Form layout={"vertical"} initialValues={initialValues} onFinish={onFinish} autoComplete="off">
      <Form.Item<configStoreProps>
        label={t("username")}
        name="username"
        rules={[{ required: true, message: t("usernameWarning") }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item<configStoreProps>
        label={t("password")}
        name="password"
        rules={[{ required: true, message: t("passwordWarning") }]}
      >
        <Input prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Flex gap={12} align="center" justify="flex-end">
          <Tooltip title="test connection with meican">
            <Button type="default" htmlType="button">
              {t("testConnection")}
            </Button>
          </Tooltip>
          <Tooltip title="save your config locally">
            <Button type="primary" htmlType="submit">
              {t("save")}
            </Button>
          </Tooltip>
        </Flex>
      </Form.Item>
    </Form>
  );
}
