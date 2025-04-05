import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import ReviewMedicineListDataTable from '../../commondata/reviewMedicineList'
import PageHeader from '../../layouts/layoutcomponents/pageheader'

export default function ReviewMedicine() {
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Review Medicines" active="Review Medicine List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-4">
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <ReviewMedicineListDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}