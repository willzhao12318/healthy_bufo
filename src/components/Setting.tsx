import { configStoreProps, useConfigStore } from "@/hooks/configStore";
import { BulbOutlined, LockOutlined, TranslationOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Tooltip, notification, theme } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { login } from "@/client/controller";
import { useCallback, useState } from "react";
import { NotificationPlacement } from "antd/es/notification/interface";

export type SettingFormProps = {
  initialValues: configStoreProps;
};

export default function SettingForm({ initialValues }: SettingFormProps) {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { getConfig, setLocale, setTheme, setCookie, cookie, setUsername, setPassword } = useConfigStore();
  const config = getConfig();
  const {
    token: { sizeMS },
  } = theme.useToken();

  const [api] = notification.useNotification();

  const errorNotification = useCallback(
    (message: string, placement: NotificationPlacement = "top") => {
      api.error({
        message: message,
        placement: placement,
        showProgress: true,
      });
    },
    [api]
  );

  const onFinish = useCallback(
    async (values: configStoreProps) => {
      setIsLogin(true);
      await login(values.username, values.password)
        .then((response) => {
          setUsername(values.username);
          setPassword(values.password);
          setCookie(response.cookie);
        })
        .catch((error) => {
          errorNotification(error.message);
        })
        .finally(() => {
          setIsLogin(false);
        });
    },
    [errorNotification, setCookie, setPassword, setUsername]
  );

  return (
    <Form
      layout={"vertical"}
      name="validateOnly"
      initialValues={initialValues}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      {process.env.NODE_ENV === "development" && (
        <>
          <Form.Item<configStoreProps>
            label={t("username")}
            name="username"
            rules={[{ message: t("usernameWarning") }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item<configStoreProps>
            label={t("password")}
            name="password"
            rules={[{ message: t("passwordWarning") }]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
        </>
      )}
      <Form.Item<configStoreProps> label={t("cookie")} name="cookie">
        <Input prefix={<LockOutlined />} placeholder={t("cookie")} />
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
          <Button
            type="primary"
            htmlType="button"
            onClick={() => {
              setCookie(form.getFieldValue("cookie"));
            }}
          >
            {t("addCookie")}
          </Button>
          <Tooltip title={cookie === undefined ? t("saveConfigDescription") : t("renewLoginDescription")}>
            <Button type="primary" htmlType="submit" loading={isLogin}>
              {cookie === undefined ? t("save") : t("renewLogin")}
            </Button>
          </Tooltip>
        </Flex>
      </Form.Item>
    </Form>
  );
}
