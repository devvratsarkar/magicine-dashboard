import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AddNewProductForm from "../../form/AddNewProductForm";

export default function AddNewProduct() {
  return (
    <div>
      <PageHeader titles="Catalogue- General Product" active="Add General Product" items={["Home", "General Product List"]} links={["/dashboard", '/catalogue/products']} />
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add Product</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewProductForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
