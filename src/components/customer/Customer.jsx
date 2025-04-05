import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { CustomerDatas } from "../../commondata/customerDatas";
import { Link } from "react-router-dom";

export default function Customer() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.User.includes("add"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Customer Data" active="Customers List" items={["Home"]} links={['/dashboard']} />
        </Col>
        <Col className="text-end">
          {/* {
            showAdd && (
              <Link to={`/add-new-customer`} className="btn btn-success text-white">Add New Customer</Link>
            )
          } */}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CustomerDatas />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
