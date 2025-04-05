import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MedicineDataTable } from "../../../commondata/medicinesDataTable";
import { getMedicineDeletedPage } from "../../../utils/routes";

function Medicine() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Medicines" active="Medicine List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          {
            showAdd && (
              <Link to="/catalogue/add-medicines" className="btn btn-success text-white me-3" > Add Medicine </Link>
            )
          }
          {
            showTrash && (
              <Link className="btn btn-danger text-white" to={`${getMedicineDeletedPage()}`}> Medicine Trashed </Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <MedicineDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Medicine;
