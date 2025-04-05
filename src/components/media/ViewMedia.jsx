import React from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import PageHeader from '../../layouts/layoutcomponents/pageheader'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/allModalSlice';
import { useGetSingleMediaQuery } from '../../redux/features/MediaEndPoints';
import { MEDIA_BASE_URL } from '../../utils/config';

export default function ViewMedia() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    // console.log("data", data.id);
    const dispatch = useDispatch()
    const { datas, isLoading } = useGetSingleMediaQuery(data.id)
    return (
        <>
            <Modal show={isOpen}>
                <Modal.Header className="bg-primary">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                        View Media
                    </Modal.Title>
                    <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="" >
                        <i className="fe fe-x"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col as={Col} md={12}>
                            <img src={`${MEDIA_BASE_URL}/${data?.image}`} alt="error" className='' />
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col>
                            <Form.Control
                                defaultValue={data?.image}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

