import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ReturnsData } from "../../commondata/returnsData";
// import { CategoryDataTable } from "../../../commondata/categorydata";

export default function Returns() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader titles="Returns" active="Return List" items={["Home"]} links={["/dashboard"]} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ReturnsData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
