import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
// import { ProductDataTable } from "../../../commondata/prodcutdata";
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getSurgicalEquipmentTrashPage } from "../../../utils/routes";
import { SurgicalEquipmentDataTable } from "../../../commondata/surgicalEquipmentData";

export default function SurgicalEquipmentMain() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Sergical_Equipment.includes("add"))
    const showtrash = role === "Admin" || (role === "Staff" && permissions.Sergical_Equipment.includes("view-trash"))
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Catalogue- Surgical Equipment" active="Surgical Equipment List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-4">
                    {
                        showAdd && (
                            <Link to="add-surgical-equipment" className="btn btn-success text-white me-3" > Add Surgical Equipment </Link>
                        )}
                    {
                        showtrash && (
                            <Link className="btn btn-danger text-white" to={`${getSurgicalEquipmentTrashPage()}`}> Surgical Equipment Trashed </Link>
                        )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <SurgicalEquipmentDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
