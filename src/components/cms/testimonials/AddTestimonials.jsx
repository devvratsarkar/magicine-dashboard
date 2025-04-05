import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

import { Link, useLocation } from "react-router-dom";
import AddBlogsForm from "../../form/AddBlogsForm";
import AddTEstimonialsForm from "../../form/AddTestimonialsForm";

export default function AddTestimonials() {


  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active={["Add Testimonials "]}
            items={["Home", "Teastimonial List"]}
            links={["/dashboard", "/cms/testimonials"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/cms/testimonials"
            className="btn btn-success text-white me-3"
          >
            View All Testimonials
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Body className="add_new_product">
              <AddTEstimonialsForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
