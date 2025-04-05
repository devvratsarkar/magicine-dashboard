import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import UseDataTable from '../../../commondata/useData'
import { openModal } from '../../../redux/slices/allModalSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Uses() {
    const dispatch = useDispatch()
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Uses.includes("add"))
    const showTrash = role === "Admin" || (role === "Staff" && permissions.Uses.includes("view-trash"))
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="Catalogue- Uses" active="Uses List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className='d-flex justify-content-end align-items-center'>
                    {
                        showAdd && (
                            <Button className='btn btn-success text-white me-3' variant='' onClick={() => { dispatch(openModal({ componentName: 'AddUses' })) }}> Add New Uses</Button>
                        )
                    }
                    {
                        showTrash && (
                            <Link to={`/catalogue/trash-uses`}><Button className='btn btn-danger text-white me-3' variant='' >Trash Uses</Button></Link>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <UseDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

