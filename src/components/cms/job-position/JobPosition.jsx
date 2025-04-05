import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { JobPositionDataTable } from "../../../commondata/JobPositionData";

export default function JobPosition() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Position.includes("add"))
    return (
        <>
            <Row className="align-items-center">
                <Col> <PageHeader titles="Job Positions" active="Job Positions List" items={["Home"]} links={['/dashboard']} /> </Col>
                <Col className="text-end d-flex justify-content-end gap-1">
                    {
                        showAdd && (
                            <Link to='add' className="btn btn-success text-white me-3" >Add Job Position</Link>
                        )
                    }
                    {/* <Link className="btn btn-danger text-white" to={`${getCategoryDeletedItemsPage()}`}>Category Trashed</Link> */}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <JobPositionDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
