import { OrderTab } from "@/utils/type";
import { Card, Col, Modal, Row, Space } from "antd";
import { compareTabType } from "@/utils/utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrders } from "@/client/controller";

export default function OrderTable() {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data: rawData } = useGetOrders();

  const data = useMemo(() => {
    if (!rawData) {
      return {};
    }
    const res = rawData.reduce((acc, order) => {
      const { time } = order;
      if (!acc[time]) {
        acc[time] = [];
      }
      acc[time].push(order.tab);
      return acc;
    }, {} as Record<string, OrderTab[]>);
    console.log(res);
    return res;
  }, [rawData]);

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", height: "100%", alignItems: "flex-start", overflowY: "scroll" }}
      >
        {Object.entries(data).map(([time, tabs]) => (
          <Card size="small" title={time} style={{ maxWidth: "900px" }} key={time}>
            <Row gutter={16}>
              {tabs.sort(compareTabType).map((tab) => (
                <Col span={8} key={tab.id}>
                  <Card hoverable size="small" style={{ width: "300px" }} onClick={showModal}>
                    <Card.Meta
                      title={i18n.language === "zh" ? tab.orderedDish?.chineseName : tab.orderedDish?.englishName}
                      description={t(tab.type)}
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
