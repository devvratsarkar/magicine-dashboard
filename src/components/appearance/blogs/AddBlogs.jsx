import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import AddNewDynamicContentForm from "../../form/AddNewDynamicContentForm";
import AddBlogsForm from "../../form/AddBlogsForm";

export default function AddBlogs() {
  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader titles="Blogs" active="Add Blog" items={["Home", "Blog List"]} links={["/dashboard", "/blogs"]} />
        </Col>
        <Col className="text-end">
          <Link to="/blogs" className="btn btn-success text-white me-3" >View All Blogs </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>Add New Blog</Card.Header>
            <Card.Body className="add_new_product">
              <AddBlogsForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
