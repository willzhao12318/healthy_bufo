import { configStoreProps, useConfigStore } from "@/hooks/configStore";
import { BulbOutlined, LockOutlined, TranslationOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Tooltip, theme } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

export type SettingFormProps = {
  initialValues: configStoreProps;
};

export default function SettingForm({ initialValues }: SettingFormProps) {
  const onFinish = (values: configStoreProps) => {
    console.log(values);
  };

  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { getConfig, setLocale, setTheme } = useConfigStore();
  const {
    token: { sizeMS },
  } = theme.useToken();
  const config = getConfig();

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
        <Flex gap={sizeMS} align="center" justify="flex-end">
          {isMobile && (
            <>
              <Button
                icon={<TranslationOutlined />}
                onClick={() => {
                  const newLocale = i18n.language === "zh" ? "en" : "zh";
                  i18n.changeLanguage(newLocale);
                  setLocale(newLocale);
                }}
              />
              <Button
                icon={<BulbOutlined />}
                onClick={() => {
                  const newTheme = config.theme === "light" ? "dark" : "light";
                  setTheme(newTheme);
                }}
              />
            </>
          )}
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
