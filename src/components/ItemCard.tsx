import { Card, Col, Row } from "antd";
import dish from "@/assets/dish.jpg";
import { OrderTab } from "@/utils/type";
import { compareTabType } from "@/utils/utils";

export type ItemCardProps = {
  time: string;
  tabs: OrderTab[];
};

export default function ItemCard({ time, tabs }: ItemCardProps) {
  const sortedTabs = tabs.sort(compareTabType);
  return (
    <Card title={time} style={{ maxWidth: "600px"}}>
      <Row gutter={16}>
        {sortedTabs.map((tab) => (
          <Col span={8} key={tab.id}>
            <Card
              hoverable
              // eslint-disable-next-line @next/next/no-img-element
              cover={<img src={dish.src} alt="dish" />}
            >
              <Card.Meta title={tab.orderedDish?.chineseName} description={tab.type} />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
