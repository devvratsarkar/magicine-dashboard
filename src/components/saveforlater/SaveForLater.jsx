import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
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
import { SaveForLaterData } from "../../commondata/SaveForLaterData";

export default function SaveForLater() {
  return (
    <>
      <PageHeader
        titles="Saved For Later"
        active="Saved For Later"
        items={["Home"]}
        links={["/dashboard"]}
      />

      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <SaveForLaterData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
