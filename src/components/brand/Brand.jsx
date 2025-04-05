import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import {
  Row,
  Card,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { BrandDataTable } from "../../commondata/brandData";
import { getBrandDeletedItem } from "../../utils/routes";

export default function Brand() {

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Brand.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Brand.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Brand" active="Brand List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {
            showAdd && (
              <Link to="/add-brand" className="btn btn-success text-white me-3">Add Brand</Link>
            )
          }
          {
            showTrash && (
              <Link className="btn btn-danger text-white" to={`${getBrandDeletedItem()}`}>Brand Trashed</Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BrandDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
