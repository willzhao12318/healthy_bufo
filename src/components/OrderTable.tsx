import { OrderTab } from "@/utils/type";
import { Card, Space } from "antd";
import { compareTabType } from "@/utils/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrders } from "@/client/controller";
import Image from "next/image";

export default function OrderTable() {
  const { t, i18n } = useTranslation();

  const { data: rawData } = useGetOrders();

  const data = useMemo(() => {
    if (!rawData) {
      return {};
    }
    const res = rawData
      .filter((order) => ["2024-12-04", "2024-12-05", "2024-12-06"].includes(order.time))
      .reduce((acc, order) => {
        const { time } = order;
        if (!acc[time]) {
          acc[time] = [];
        }
        acc[time].push(order.tab);
        return acc;
      }, {} as Record<string, OrderTab[]>);
    return res;
  }, [rawData]);

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ width: "100%", height: "100%", alignItems: "flex-start", overflowY: "scroll" }}
    >
      {Object.entries(data).map(([time, tabs]) => (
        <Card size="small" title={time} key={time} style={{ width: "100%" }}>
          <Space direction="horizontal" size="small" align="start">
            {tabs.sort(compareTabType).map((tab) => (
              <Card
                hoverable
                key={tab.id}
                size="small"
                cover={
                  <Image
                    src={`/static/dishes/${tab.orderedDish?.id}.png`}
                    alt={tab.orderedDish?.id ?? ""}
                    width={200}
                    height={200}
                  />
                }
                style={{ width: "200px" }}
              >
                <Card.Meta
                  title={t(tab.type)}
                  description={i18n.language === "zh" ? tab.orderedDish?.chineseName : tab.orderedDish?.englishName}
                />
              </Card>
            ))}
          </Space>
        </Card>
      ))}
    </Space>
  );
}
