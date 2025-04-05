import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../redux/slices/allModalSlice'
import { useSelector } from 'react-redux'
// import Form from '../catalogue/form/Form'

export default function ViewBlogComment() {
    const dispatch = useDispatch()
    const { isOpen, data } = useSelector((state) => state.allCommonModal);

    return (
        <>
            <Modal show={isOpen} size='lg'>
                <Modal.Header className='bg-primary'>
                    <Modal.Title className='mb-0 text-light'>View Blog Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        value={data?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        value={data?.email}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        value={data?.website}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Blog Title</Form.Label>
                                    <Form.Control
                                        value={data?.blog_id?.title}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={data?.comment}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => dispatch(closeModal())}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
