import React from 'react'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import PopUpDataTable from '../../commondata/popUpData'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Row } from 'react-bootstrap'

export default function PopUp() {
    const dispatch = useDispatch()
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="Pop Up" active="Pop Up List" items={["Home"]} links={['/dashboard']} />
                </Col>
            </Row>
            <Row className='justify-content-end mb-4'>
                <Col as={Col} md={6} className='d-flex justify-content-end'>
                    <Link to={'/add-pop-up'}><Button className='btn-success' variant=''>Add Pop-up</Button></Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <PopUpDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
