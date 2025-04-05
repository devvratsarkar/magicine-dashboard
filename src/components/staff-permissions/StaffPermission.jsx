import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import StaffPermissionDataTable from '../../commondata/staffPermissionData'
import { Link } from 'react-router-dom'

export default function StaffPermission() {
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="Staff-Permissions" active="Staff List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className="text-end d-flex justify-content-end align-items-center">
                    <Link to="/add-staff-permissions" className="btn btn-success text-white me-3 h-auto" > Add Staff</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <StaffPermissionDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

