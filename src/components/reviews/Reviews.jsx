import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ReviewData } from "../../commondata/reviewData";
export default function Reviews() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Review.includes("add"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Reviews" active="Review List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {
            showAdd && (
              <Link to="/product-review" className="btn btn-success text-white me-3">
                Add New Reviews
              </Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ReviewData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
