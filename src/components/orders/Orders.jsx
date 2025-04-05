import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { OrdersDataTable } from "../../commondata/ordersdata";

export default function Orders() {

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Orders"
                active="Orders"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <OrdersDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
