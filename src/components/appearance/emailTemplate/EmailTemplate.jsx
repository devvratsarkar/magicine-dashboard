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

export default function EmailTemplate() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Appearance"
                active="Email Template List"
                items={["Home",]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end">
              <Link
                to="/appearance/add-new-email-template"
                className="btn btn-success text-white me-3"
              >
                Add Email Template
              </Link>
              <Link to={`/soft-delete`} state={{ name: "Email-Template" }} className="btn btn-danger">Email Template Trash</Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <EmailTemplateData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
