import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { ProductDataTable } from "../../../commondata/prodcutdata";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProductTrashPage } from "../../../utils/routes";

export default function Products() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Product.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Product.includes("view-trash"))

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Catalogue- General Product" active="General Product List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {
            showAdd && (
              <Link to="/catalogue/add-new-product" className="btn btn-success text-white me-3" > Add General Product </Link>
            )}
          {showTrash && (
            <Link className="btn btn-danger text-white" to={`${getProductTrashPage()}`}> Product Trashed </Link>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <ProductDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
