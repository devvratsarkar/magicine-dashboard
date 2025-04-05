import React from "react";
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
import { Link } from "react-router-dom";
import { EmailTemplateData } from "../../../commondata/emailTemplateData";
import { DynamicContentData } from "../../../commondata/dynamicContentData";

export default function DynamicContent() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Appearance"
                active="Dynamic Content List"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end">
              <Link
                to="/appearance/add-new-dynamic-content"
                className="btn btn-success text-white me-3"
              >
                Add Dynamic Content
              </Link>
              <Link to={`/soft-delete`} state={{ name: "Dynamic-Content" }} className="btn btn-danger">Dynamic Content Trash</Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <DynamicContentData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
