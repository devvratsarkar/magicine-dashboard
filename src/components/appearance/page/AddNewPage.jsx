import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

import { Link } from "react-router-dom";
import AddNewPageForm from "../../form/AddNewPageForm";
export default function AddNewPage() {
  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active="Add page"
            items={["Home", "Page List"]}
            links={["/dashboard", "/appearance/page"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/appearance/page"
            className="btn btn-success text-white me-3"
          >
            View All Page
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              {/* <h3 className="card-title">Add Page</h3> */}
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewPageForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
