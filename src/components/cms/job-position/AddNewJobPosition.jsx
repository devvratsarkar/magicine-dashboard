import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import AddNewCategoryForm from "../../form/AddNewCategoryForm";
import { Link } from "react-router-dom";
import AddJobPositionForm from "../../form/AddJobPositionForm";
import { getJobApplication } from "../../../utils/routes";
export default function AddJobPosition() {
    return (
        <div>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles="Add New Job Position" active="Add New Job Position" items={["Home", "Job Position"]} links={["/dashboard", "/cms"]} />
                </Col>
                <Col className="text-end">
                    <Link to={getJobApplication()} className="btn btn-success text-white me-3" >View All Job Position</Link>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Add Job Position</h3>
                        </Card.Header>
                        <Card.Body className="add_new_product">
                            <AddJobPositionForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
