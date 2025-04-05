import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { AddTopicValidation } from "../../../commondata/formvalidations";
import { useFormik } from "formik";
const initialValues = {
  topic_name: "Buying Process",
  for: "Customer",
  status: "active",
};

export default function EditTopic({ show, hide }) {
  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: AddTopicValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <Modal show={show}>
        <Modal.Header className="border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Edit Topic
          </Modal.Title>
          <Button onClick={() => hide(false)} className="btn-close" variant="">
            x
          </Button>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form onSubmit={handleSubmit}>
            <Row className="pb-3">
              <Col as={Col} sm={6}>
                <Form.Group md="12">
                  <Form.Label className="text-start">
                    Topic Name <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="topic_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.topic_name}
                  />
                  {errors.topic_name && touched.topic_name ? (
                    <p className={`error`}>{errors.topic_name}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} sm={6}>
                <Form.Group>
                  <Form.Label className="text-start">
                    For <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Select
                    type="text"
                    name="for"
                    placeholder="Select Attribute Type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.for}
                  >
                    <option value="select">Select</option>
                    <option value="Merchant">Merchant</option>
                    <option value="Customer">Customer</option>
                  </Form.Select>

                  {errors.for && touched.for ? (
                    <p className={`error`}>{errors.for}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} sm={12}>
                <Form.Group>
                  <Form.Label className="text-start">
                    Status <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Select
                    type="text"
                    name="status"
                    placeholder="Select Attribute Type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.status}
                  >
                    <option value="select">Select</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>

                  {errors.status && touched.status ? (
                    <p className={`error`}>{errors.status}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button
            className="btn btn-outline-default cancel_button"
            variant=""
            onClick={() => hide(false)}
          >
            Close
          </Button>
          <Button
            className="btn btn-primary"
            variant="primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
