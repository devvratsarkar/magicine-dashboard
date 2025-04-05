import React from "react";

import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AddNewCarrierForm from "../../form/AddNewCarrierForm";
function AddNewCarrier() {
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Shipping-Carrier" active="Add New Carrier" items={["Home", "Carrier List"]} links={["/dashboard", "/shipping/carrier"]} />
        </Col>
        <Col className="text-end">
          <Link to="/shipping/carrier" className="btn btn-success text-white me-3" > View All Carriers </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add Carrier</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewCarrierForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default AddNewCarrier;
