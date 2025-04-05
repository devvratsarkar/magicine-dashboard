import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

import { Link } from "react-router-dom";
import AddNewDynamicContentForm from "../../form/AddNewDynamicContentForm";

export default function AddNewDynamicContent() {
  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active="Add Dynamic Content"
            items={["Home", "Dynamic Content List"]}
            links={["/dashboard", "/appearance/dynamic-content"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/appearance/dynamic-content"
            className="btn btn-success text-white me-3"
          >
            View All Dynamic Content
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              {/* <h3 className="card-title">Add Dynamic Content</h3> */}
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewDynamicContentForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
