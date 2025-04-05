import React, { useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ManufacturerDataTable } from "../../commondata/manufacturerData";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import { getManufacturerDeletedItem } from "../../utils/routes";

export default function MarketManufacturer() {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Marketer.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Marketer.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Manufactutrer" active="Manufactutrer" items={["Home"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-1">
          {
            showAdd && (
              <Button onClick={() => { dispatch(openModal({ componentName: 'AddNewManufacturer' })) }} className="btn btn-success text-white me-3 border-success" >
                Add Manufacturer
              </Button>
            )
          }
          {
            showTrash && (
              <Link className="btn btn-danger text-white" to={`${getManufacturerDeletedItem()}`} state={{ name: "Manufacturer" }} >
                Market/Manufacturer Trashed
              </Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Card className="data_table">
          <Card.Body >
            <ManufacturerDataTable />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}
