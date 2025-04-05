import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { AddFAQValidation } from "../../../commondata/formvalidations";
import { useFormik } from "formik";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";
const initialValues = {
  topic: "Merchant",
  status: "inactive",
  question: "hello world",
  answer: "hello world",
};

export default function EditFAQ({ show, hide }) {
  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: AddFAQValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <Modal show={show} className="faq_modal">
        <Modal.Header className="border-0 border-bottom-0">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Edit FAQ
          </Modal.Title>
          <Button onClick={() => hide(false)} className="btn-close" variant="">
            x
          </Button>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form onSubmit={handleSubmit}>
            <Row className="pb-3">
              <Col as={Col} sm={6}>
                <Form.Group>
                  <Form.Label className="text-start">
                    Topic <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Select
                    type="text"
                    name="topic"
                    placeholder="Select Attribute Type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.topic}
                  >
                    <option value="">Select</option>
                    <option value="Payment Related">Payment Related</option>
                    <option value="Merchant">Merchant</option>
                    <option value="Customer">Customer</option>
                  </Form.Select>

                  {errors.topic && touched.for ? (
                    <p className={`error`}>{errors.topic}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} sm={6}>
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
                    <option value="inactive">InActive</option>
                  </Form.Select>

                  {errors.status && touched.status ? (
                    <p className={`error`}>{errors.status}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} sm={12}>
                <Form.Group>
                  <Form.Label className="text-start">
                    Question <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="question"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.question}
                  />

                  {errors.question && touched.question ? (
                    <p className={`error`}>{errors.question}</p>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} sm={12}>
                <Form.Group>
                  <Form.Label className="text-start">
                    Answer <span className="required_icon">*</span>
                  </Form.Label>
                  <SunEditor
                    setOptions={options_for_sunEditor}
                    name="answer"
                    onChange={(answer) => setFieldValue("answer", answer)}
                    onBlur={() => setFieldTouched("answer", true)}
                    setContents={values.answer}
                  />

                  {errors.answer && touched.answer ? (
                    <p className={`error`}>{errors.answer}</p>
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
