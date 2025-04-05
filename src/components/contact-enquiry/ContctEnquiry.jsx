import React from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import {
    Nav,
    TabContainer,
    Tabs,
    Tab,
    Row,
    Card,
    Col,
    Button,
} from "react-bootstrap";
import { SubscribersDataTable } from "../../commondata/subscribersData";
import { Link } from "react-router-dom";
import { ContactEnquiryDataTable } from "../../commondata/contactEnquiryData";


export default function ContctEnquiry() {
    return (
        <>
            <Row>
                <Col>
                    <Row className="align-items-center">
                        <Col>
                            <PageHeader
                                titles="Customer Data - Contact Enquiries"
                                active="Contact Enquiries"
                                items={["Home"]}
                                links={["/dashboard"]}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <ContactEnquiryDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}