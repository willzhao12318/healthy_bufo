import { Order, OrderTab, TabType } from "@/utils/type";
import dish from "@/assets/dish.jpg";
import { Card, Col, Modal, Row, Space, Typography, theme } from "antd";
import { compareTabType } from "@/utils/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const mockData: Order[] = [
  {
    id: "1",
    time: "2024-12-02",
    tab: {
      id: "1",
      type: TabType.Breakfast,
      orderedDish: {
        id: "1",
        chineseName: "测试",
        englishName: "test",
        restaurant: {
          id: "1",
          name: "test",
        },
      },
      status: "pending",
    },
  },
  {
    id: "2",
    time: "2024-12-02",
    tab: {
      id: "2",
      type: TabType.Lunch,
      orderedDish: {
        id: "2",
        chineseName: "测试2",
        englishName: "test2",
        restaurant: {
          id: "2",
          name: "test2",
        },
      },
      status: "pending",
    },
  },
  {
    id: "3",
    time: "2024-12-02",
    tab: {
      id: "3",
      type: TabType.AfternoonTea,
      orderedDish: {
        id: "3",
        chineseName: "测试3",
        englishName: "test3",
        restaurant: {
          id: "3",
          name: "test3",
        },
      },
      status: "pending",
    },
  },
  {
    id: "4",
    time: "2024-12-03",
    tab: {
      id: "4",
      type: TabType.Breakfast,
      orderedDish: {
        id: "4",
        chineseName: "测试4",
        englishName: "test4",
        restaurant: {
          id: "4",
          name: "test4",
        },
      },
      status: "pending",
    },
  },
];

export default function OrderTable() {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    token: { fontSizeMS },
  } = theme.useToken();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data = mockData.reduce((acc, order) => {
    const { time } = order;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(order.tab);
    return acc;
  }, {} as Record<string, OrderTab[]>);

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%", alignItems: "center" }}>
        {Object.entries(data).map(([time, tabs]) => (
          <Card size="small" title={time} style={{ maxWidth: "600px" }} key={time}>
            <Row gutter={16}>
              {tabs.sort(compareTabType).map((tab) => (
                <Col span={8} key={tab.id}>
                  <Card
                    hoverable
                    size="small"
                    // eslint-disable-next-line @next/next/no-img-element
                    cover={<img src={dish.src} alt="dish" />}
                    onClick={showModal}
                  >
                    <Card.Meta
                      title={<Typography.Title level={5}>{tab.type}</Typography.Title>}
                      description={
                        <Typography.Title style={{ fontSize: `${fontSizeMS}px` }}>
                          {i18n.language === "zh-CN" ? tab.orderedDish?.chineseName : tab.orderedDish?.englishName}
                        </Typography.Title>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </Space>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        cancelText={t("cancel")}
        okText={t("confirm")}
      >
        <p>Some contents...</p>
      </Modal>
    </>
  );
}
