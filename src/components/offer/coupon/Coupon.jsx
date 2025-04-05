import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";

import { Link } from "react-router-dom";
import { CouponData } from "../../../commondata/couponDatas";
import { getDeletedCouponPage } from "../../../utils/routes";

export default function Coupon() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Coupons" active="Coupon List" items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-2">
          {
            showAdd && (
              <Link className="btn btn-success text-white" to={`/add-new-coupon`}> Add New Coupon </Link>
            )
          }
          {
            showTrash && (
              <Link className="btn btn-danger text-white" to={`${getDeletedCouponPage()}`} state={{ name: "Coupon" }} > Coupon Trashed </Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CouponData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}