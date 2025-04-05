import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

import { Link } from "react-router-dom";
import AddNewEmailTemplateForm from "../../form/AddNewEmailTemplateForm";

export default function AddNewEmailTemplate() {
  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active="Add"
            items={["Home", "Email Template List"]}
            links={["/dashboard", "/appearance/email-template"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/appearance/email-template"
            className="btn btn-success text-white me-3"
          >
            View All Email Templates
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              {/* <h3 className="card-title">Add Email Template</h3> */}
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewEmailTemplateForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
