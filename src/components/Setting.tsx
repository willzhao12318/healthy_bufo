import { configStoreProps, useConfigStore } from "@/hooks/configStore";
import { BulbOutlined, LockOutlined, PlusCircleOutlined, TranslationOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Tooltip, notification, theme } from "antd";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { login, useAddOrder } from "@/client/controller";
import { AddOrderRequest } from "@/utils/type";
import { useCallback, useState } from "react";
import { NotificationPlacement } from "antd/es/notification/interface";

export type SettingFormProps = {
  initialValues: configStoreProps;
};

export default function SettingForm({ initialValues }: SettingFormProps) {
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

  const { trigger: addOrder } = useAddOrder();
  const req: AddOrderRequest = {
    tabUid: "2f4b4930-aacb-4e04-9b8b-9d659e3736f3",
    targetTime: "2024-12-05 00:30",
    dishId: "281269727",
  };

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
    <Form layout={"vertical"} name="validateOnly" initialValues={initialValues} onFinish={onFinish} autoComplete="off">
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
        <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
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
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  addOrder(req);
                }}
              />
            </>
          )}
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
