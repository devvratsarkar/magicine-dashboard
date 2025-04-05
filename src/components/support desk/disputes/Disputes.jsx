import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import {
  Nav,
  TabContainer,
  Tabs,
  Tab,
  Row,
  Card,
  Col,
  Button,
} from "react-bootstrap";

import { DisputesDataTable } from "../../../commondata/disputesDataTable";

export default function Dispute() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Support Desk"
                active="Disputes"
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
              <DisputesDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
