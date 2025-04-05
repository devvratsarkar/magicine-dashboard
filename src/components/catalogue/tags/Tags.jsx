import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { Link } from 'react-router-dom'
import AddTags from './AddTags'
import { useDispatch } from 'react-redux'
import { openModal } from '../../../redux/slices/allModalSlice'
import { TagsDataTable } from '../../../commondata/tagsData'

function Tags() {
    const dispatch = useDispatch();
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Tags.includes("add"))
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <PageHeader titles="Tags" active="Tags List" items={["Home"]} links={["/dashboard"]} />
                </Col>
                <Col className='text-end'>
                    {
                        showAdd && (
                            <Button className='btn btn-success' variant='' onClick={() => { dispatch(openModal({ componentName: 'AddTags' })) }}>Add New Tag </Button>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Card className='data_table'>
                    <Card.Body>
                        <TagsDataTable />
                    </Card.Body>
                </Card>
            </Row>
        </>
    )
}

export default Tags