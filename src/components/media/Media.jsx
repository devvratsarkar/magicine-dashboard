import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { MediaDataTable } from '../../commondata/mediaData'
import { useDispatch } from 'react-redux'
import { openModal } from '../../redux/slices/allModalSlice'

export default function Media() {
    const dispatch = useDispatch()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Media.includes("add"))
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="Media" active="Media List" items={["Home"]} links={['/dashboard']} />
                </Col>
                <Col className="d-grid justify-content-end align-items-center">
                    {
                        showAdd && (
                            <Button className="btn btn-success text-white me-3" variant='' onClick={() => { dispatch(openModal({ componentName: 'AddMedia' })) }}>
                                Add New Media
                            </Button>
                        )
                    }
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <MediaDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}


