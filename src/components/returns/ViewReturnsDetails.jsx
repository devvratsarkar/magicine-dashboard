import { useFormik } from 'formik';
import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

const initialValues = {
    status: "pending",
    reason: "",
    pick_up_data: "",
}

export default function ViewReturnsDetails() {
    const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: "",
        onSubmit: async (values) => {
            if (values.status === "rejected") {
                console.log({ status: values.status, reason: values.reason });
            } else if (values.status === "pickup-scheduled") {
                console.log({ status: values.status, pick_up_data: values.pick_up_data });
            } else {
                console.log({ status: values.status });
            }
        }
    });

    return (
        <>
            <Card>
                <Card.Body>
                    <Row>
                        <p>Order No. - ABQ1921</p>
                        <p>Items Requested For Return - 2/5</p>
                        <p>Grand Total - Rs. 1200</p>
                        <p>Payment Status - successful</p>
                        <p>Return Requested At - 10:15 AM on 25.04.2024</p>
                    </Row>
                    <Row className='mt-6'>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-4">
                                <Form.Group as={Col} md={12}>
                                    <Form.Label>
                                        Status <span className="required_icon">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="status"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.status}
                                        disabled
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="approved">Approved</option>
                                        <option value="pickup-scheduled">Pickup Scheduled</option>
                                        <option value="collected">Collected</option>
                                        <option value="refunded">Refunded</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            {values.status === 'rejected' && (
                                <Row className="mb-4">
                                    <Form.Group as={Col} md={12}>
                                        <Form.Label>
                                            Rejection Reason (If Status Is Rejected) <span className="required_icon">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name='reason'
                                            value={values.reason}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={4}
                                            required
                                            readOnly
                                        />
                                        {errors.reason && touched.reason ? (
                                            <p className="error">{errors.reason}</p>
                                        ) : null}
                                    </Form.Group>
                                </Row>)}
                            {values.status === 'pickup-scheduled' && (
                                <Row className="mb-4">
                                    <Form.Group as={Col} md={12}>
                                        <Form.Label>
                                            Pick Up Date (If Status Is Pick Up Scheduled) <span className="required_icon">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type='date'
                                            name='pick_up_data'
                                            value={values.pick_up_data}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            readOnly
                                        />
                                        {errors.pick_up_data && touched.pick_up_data ? (
                                            <p className="error">{errors.pick_up_data}</p>
                                        ) : null}
                                    </Form.Group>
                                </Row>)}
                            {/* <Row className="gap-3 justify-content-center">
                                <Button type="submit" className="btn-primary w-auto">Submit</Button>
                            </Row> */}
                        </Form>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}
