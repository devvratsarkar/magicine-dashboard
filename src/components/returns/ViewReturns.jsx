import React from 'react'
import { Row, Col } from "react-bootstrap";
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import CustomerDetails from './CustomerDetails';
import { Link, useLocation } from 'react-router-dom';
import ViewReturnsDetails from './ViewReturnsDetails';

export default function ViewReturns() {
    return (
        <>
            <Row>
                <Col>
                    <Row className="align-items-center">
                        <Col>
                            <PageHeader titles="Returns" active={["View Returns/"]} items={["Home", "Return List"]} links={["/dashboard", "/returns"]} />
                        </Col>
                        <Col className="text-end">
                            <Link to="/returns" className="btn btn-success text-white me-3" >
                                View All Returns
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col as={Col} xl={8} lg={7} md={7} sm={12} xs={12}>
                    <ViewReturnsDetails />
                </Col>
                <Col as={Col} xl={4} lg={5} md={5} sm={12} xs={12}>
                    <CustomerDetails />
                </Col>
            </Row>
        </>
    )
}
