import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';

function SeoForm({ touched, handleChange, values, errors, handleBlur, readOnlyStatus }) {
    return (
        <>
            {/* <Form onSubmit={handleSubmit}> */}
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Meta Title</Form.Label>
                        <Form.Control
                            name='meta_title'
                            value={values.meta_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            readOnly={readOnlyStatus}
                        />
                        {/* {errors.meta_title && touched.meta_title && (
                            <p className="error">{errors.meta_title}</p>
                        )} */}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Meta Description</Form.Label>
                        <Form.Control
                            name='meta_description'
                            value={values.meta_description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            readOnly={readOnlyStatus}
                        />
                        {/* {errors.meta_description && touched.meta_description && (
                            <p className="error">{errors.meta_description}</p>
                        )} */}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Meta Keywords</Form.Label>
                        <Form.Control
                            as="textarea"
                            name='meta_keywords'
                            value={values.meta_keywords}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={4}
                            readOnly={readOnlyStatus}
                        />
                        {/* {errors.meta_keywords && touched.meta_keywords && (
                            <p className="error">{errors.meta_keywords}</p>
                        )} */}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>OG Tags</Form.Label>
                        <Form.Control
                            as="textarea"
                            name='og_tag'
                            value={values.og_tag}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={4}
                            readOnly={readOnlyStatus}
                        />
                        {/* {errors.og_tag && touched.og_tag && (
                            <p className="error">{errors.og_tag}</p>
                        )} */}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label>Schema Markups</Form.Label>
                        <Form.Control
                            as="textarea"
                            name='schema_markup'
                            value={values.schema_markup}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={4}
                            readOnly={readOnlyStatus}
                        />
                        {/* {errors.schema_markup && touched.schema_markup && (
                            <p className="error">{errors.schema_markup}</p>
                        )} */}
                    </Form.Group>
                </Col>
            </Row>
            {/* </Form> */}
        </>
    );
}

export default SeoForm;
