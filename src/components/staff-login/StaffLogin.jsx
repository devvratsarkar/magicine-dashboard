import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import PopUpDataTable from '../../commondata/popUpData'
import { useDispatch } from 'react-redux'
import { openModal } from '../../redux/slices/allModalSlice'
import LoginDataTale from '../../commondata/LoginDataTale'

export default function StaffLogin() {
    const dispatch = useDispatch()
    return (
        <>
            <Row>
                <Col>
                    <PageHeader titles="Login Data" active="Staff Login" items={["Home"]} links={['/dashboard']} />
                </Col>
            </Row>
            <Row className='justify-content-end mb-4'>
                {/* <Col as={Col} md={6} className='d-flex justify-content-end'>
                    <Button className='btn-success' variant='' onClick={() => dispatch(openModal({ componentName: 'AddPopUpModel' }))}>Add Pop-up</Button>
                </Col> */}
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <LoginDataTale />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
