import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useGetAllDisputesQuery, useGetAllMessagesQuery, useSendDisputeMessagesMutation } from '../../redux/features/disputeEndPoint'
import Loader from '../../layouts/layoutcomponents/loader'
import 'react-chat-elements/dist/main.css';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { DisputeMessageValidation } from '../../commondata/formvalidations'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { closeModal } from '../../redux/slices/allModalSlice'

export default function ReplyDisputeMessage() {
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const [sendDisputeMessages, { isLoading: loading }] = useSendDisputeMessagesMutation()
    const { refetch } = useGetAllDisputesQuery();
    const { refetch: perticularId } = useGetAllMessagesQuery(data?.id);



    const dispatch = useDispatch()

    const initialValues = {
        orderId: data?.orderId,
        disputeId: data?.id,
        message: "",
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: DisputeMessageValidation,
        onSubmit: async (values) => {
            try {
                console.log("values", values);
                const response = await sendDisputeMessages(values);
                if (response?.data?.http_status_code === 200) {
                    refetch()
                    perticularId()
                    toast.success(response.data.message)
                    dispatch(closeModal())
                }
            } catch (error) {
                dispatch(closeModal())
                toast.error(error.message)
            }
        },
    });


    return (
        <>
            {loading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="bg-primary">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                        Dispute Reply
                    </Modal.Title>
                    <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="" >
                        <i className="fe fe-x"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="p-2">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>
                                        Message<span className="text-danger">*</span>
                                    </Form.Label>
                                    <textarea
                                        type="text"
                                        name="message"
                                        value={values.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className='border border-dark w-100 rounded-3 '
                                        rows={5}
                                    />
                                    {errors.message && touched.message ? (
                                        <p className="error">{errors.message}</p>
                                    ) : null}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="my-2 justify-content-center">
                            <button type="submit" className="btn btn-primary w-auto mt-3">
                                Update
                            </button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}