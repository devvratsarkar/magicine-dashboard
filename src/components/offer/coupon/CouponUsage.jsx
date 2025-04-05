import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card } from "react-bootstrap";

import { Link } from "react-router-dom";
import { CouponData } from "../../../commondata/couponDatas";
import { getDeletedCouponPage } from "../../../utils/routes";
import { CouponUsageDataTable } from "../../../commondata/couponDataTable";

export default function Couponusage() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("add"))
    const showTrash = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("view-trash"))
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Coupons" active="Coupon Usage List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2">
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <CouponUsageDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}