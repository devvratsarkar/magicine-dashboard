import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { SubscribersDataTable } from "../../commondata/subscribersData";
import { Link } from "react-router-dom";


export default function Subscribers() {
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Customer Data - Subscribers" active="Subscribers List" items={["Home"]} links={["/dashboard"]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <SubscribersDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}