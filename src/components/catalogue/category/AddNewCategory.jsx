import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AddNewCategoryForm from "../../form/AddNewCategoryForm";
import { Link } from "react-router-dom";
export default function AddNewCategory() {
  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader titles="Add New Category" active="Add New Category" items={["Home", "Category List"]} links={["/dashboard", "/catalogue/category/"]} />
        </Col>
        <Col className="text-end">
          <Link to="/catalogue/category" className="btn btn-success text-white me-3" >View All category</Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add Category</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewCategoryForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
