import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { DisputeDataTable } from "../../commondata/disputeData";


export default function Dispute() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Service Request Against Order" active="Service Request Against Order List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-4">
                    {/* <Link to="/catalogue/add-new-product" className="btn btn-success text-white me-3" > Add General Product </Link> */}
                    {/* <Link className="btn btn-danger text-white" to={`${getProductTrashPage()}`}> Product Trashed </Link> */}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <DisputeDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
