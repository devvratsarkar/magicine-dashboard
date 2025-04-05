import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AddNewCoupounForm from "../../form/AddNewCoupounForm";
import { Link } from "react-router-dom";

export default function AddNewCoupon() {
  return (
    <div>
      <Row>
        <Col as={Col} sm={8} xs={12}>
          <PageHeader titles="Coupon" active="Add New Coupon" items={["Home", "Coupon List"]} links={["/dashboard", "/coupon"]} />
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <Link className="btn btn-success text-white me-3" to={"/coupon"}>
            View All Coupons
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Add New Coupon</h3>
            </Card.Header>
            <Card.Body className="add_new_product">
              <AddNewCoupounForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}