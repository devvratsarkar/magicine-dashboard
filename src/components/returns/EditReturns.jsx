import React from "react";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import CustomerDetails from "./CustomerDetails";
import EditReturnsDetails from "./EditReturnsDetails";
import { Link, useLocation } from "react-router-dom";

export default function EditReturns() {
    const location = useLocation();
    const { name } = location.state.name;
    return (
        <>
            <Row>
                <Col>
                    <Row className="align-items-center">
                        <Col>
                            <PageHeader
                                titles="Returns"
                                active={["Edit Returns/"]}
                                items={["Home", "Return List"]}
                                links={["/dashboard", "/returns"]}
                            />
                        </Col>
                        <Col className="text-end">
                            <Link to="/returns" className="btn btn-success text-white me-3">
                                View All Returns
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col as={Col} xl={8} lg={7} md={7} sm={12} xs={12}>
                    <EditReturnsDetails />
                </Col>
                <Col as={Col} xl={4} lg={5} md={5} sm={12} xs={12}>
                    <CustomerDetails />
                </Col>
            </Row>
        </>
    );
}
