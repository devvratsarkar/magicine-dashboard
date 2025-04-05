import React, { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";
import { SalesBannerData } from "../../../commondata/salesBannerData";
import AddSalesBanner from "./AddSalesBanner";
import { openModal } from "../../../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";

export default function SalesBanner() {
  const dispatch = useDispatch()

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.SalesBanner.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.SalesBanner.includes("view-trash"))

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Sales Banner"
                active="Sales Banner List"
                items={["Home",]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="d-flex justify-content-end gap-3">
              {
                showAdd && (
                  <Button
                    className="btn btn-success"
                    variant="success"
                    onClick={() => { dispatch(openModal({ componentName: 'AddSalesBanner' })) }}
                  >
                    Add Sale Banner
                  </Button>
                )
              }
              {
                showTrash && (
                  <Link to={`/appearance/trash-sales-banner`} state={{ name: "Sales Banner" }} className="btn btn-danger">Sales Banner Trashed</Link>
                )
              }
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="slae_banner_table p-0">
              <SalesBannerData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
