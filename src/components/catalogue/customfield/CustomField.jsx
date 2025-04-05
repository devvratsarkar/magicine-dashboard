import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddCustomField from "./AddCustomField";
import { CustomFieldDataTable } from "../../../commondata/customfielddata";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import { getCustomFieldTrashPage } from "../../../utils/routes";

export default function CustomField() {
    const dispatch = useDispatch();
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.CustomFiled.includes("add"))
    const showTrash = role === "Admin" || (role === "Staff" && permissions.CustomFiled.includes("view-trash"))
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Catalogue - CustomField" active="Custom Field" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                    {
                        showAdd && (
                            <Button onClick={() => { dispatch(openModal({ componentName: 'AddCustomField', })) }} className="btn btn-success" variant="success" > Add Custom Fields </Button>
                        )
                    }
                    {
                        showTrash && (
                            <Link className="btn btn-danger text-white" to={getCustomFieldTrashPage()} state={{ name: "Custom-Field" }} >Custom Field Trashed</Link>
                        )
                    }
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <CustomFieldDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
