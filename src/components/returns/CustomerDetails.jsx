import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

export default function CustomerDetails() {
  return (
    <>
      <Card>
        <Card.Body className="order_details_data">
          <Row className="row_border row_bg">
            <Col className="text-center">Customer Details</Col>
          </Row>
          <Row className="mb-5">
            <div className="customer_details">
              <p>Name - Rahul Sharma</p>
              <p>Email ID - rahulsharma123@gmail.com</p>
              <p>Phone - +91-9999999999</p>
              <div className="d-flex gap-1">
                <Button className="btn btn-success" variant="success">
                  Send Notification
                </Button>
                <Button className="btn btn-primary" variant="primary">
                  <i className="fa fa-download"></i>&nbsp;Download Invoice
                </Button>
              </div>
            </div>
          </Row>
          <Row className="row_border row_bg">
            <Col className="text-center">Shipping Address</Col>
          </Row>
          <Row className="mb-3">
            <p>
              23, 23 Shakespeare Sarani, Salt Lake Kolkata, West Bengal, 700017
              22479991, india
            </p>
            <p>Phone - +91-9999999999</p>
          </Row>
          <Row className="row_border row_bg">
            <Col className="text-center">Billing Address</Col>
          </Row>
          <Row>
            <p>
              23, 23 Shakespeare Sarani, Salt Lake Kolkata, West Bengal, 700017
              22479991, india
            </p>
            <p>Phone - +91-9999999999</p>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
