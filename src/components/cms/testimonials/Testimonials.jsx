import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import {
  Nav,
  TabContainer,
  Tabs,
  Tab,
  Row,
  Card,
  Col,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { TestimonialsData } from "../../../commondata/testimonialsData";

export default function Testimonials() {

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Testimonial.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Testimonial.includes("view-trash"))
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="CMS-Testimonials"
                active="Testimonial List"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end">
              {
                showAdd && (
                  <Link
                    to="/cms/add-testimonials"
                    className="btn btn-success text-white me-3"
                  >
                    Add New Testimonials
                  </Link>
                )
              }
              {
                showTrash && (
                  <Link to={`/cms/trash-testimonials`} state={{ name: "Testimonials" }} className="btn btn-danger">Testimonials Trashed</Link>
                )
              }
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <TestimonialsData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
