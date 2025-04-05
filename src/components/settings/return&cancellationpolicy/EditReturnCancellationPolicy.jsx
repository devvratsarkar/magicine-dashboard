import React from "react";
import { useFormik } from "formik";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import { returnCancellationPolicyValidation } from "../../../commondata/formvalidations";
import ReactQuill from "react-quill";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function EditReturnCancellationPolicy({ show, hide, ReturnID }) {
  const initialValues = {
    category: "category1",
    subject: "Return Policy",
    message:
      "Lorem ipsum dolor sit amet consectetur. Elit aliquam et nec varius dui dictumst urna facilisis sed.",
  };
  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: returnCancellationPolicyValidation,
    onSubmit: async (values) => {
      console.log(values);
      hide(false);
    },
  });
  return (
    <div>
      <Modal show={show} className="specification_modal">
        <Modal.Header className="bg-primary border-0 border-bottom-0">
          <Modal.Title
            as="h4"
            className="fw-semibold lh-1 my-auto text-center txt-white"
          >
            Edit Return Policy
          </Modal.Title>
          <Button
            onClick={() => hide(false)}
            className="btn-close text-white"
            variant=""
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group as={Col} sm={12}>
                <Form.Label className="text-start">
                  Category <span className="required_icon">*</span>
                </Form.Label>
                <Form.Select
                  type="text"
                  name="category"
                  placeholder="Select Attribute Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.category}
                >
                  <option value="select">Select</option>
                  <option value="category1">category1</option>
                  <option value="category2">category2</option>
                </Form.Select>

                {errors.category && touched.category ? (
                  <p className={`error`}>{errors.category}</p>
                ) : null}
              </Form.Group>
              <Form.Group as={Col} sm={12}>
                <Form.Label className="text-start">
                  Subject <span className="required_icon">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder="Select Attribute Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subject}
                ></Form.Control>

                {errors.subject && touched.subject ? (
                  <p className={`error`}>{errors.subject}</p>
                ) : null}
              </Form.Group>

              <Form.Group as={Col} md="12">
                <Form.Label className="text-start">
                  Message <span className="required_icon">*</span>
                </Form.Label>
                <SunEditor
                  setOptions={options_for_sunEditor}
                  type="text"
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  setContents={values.message}
                />
                {errors.message && touched.message ? (
                  <p className={`error`}>{errors.message}</p>
                ) : null}
              </Form.Group>
            </Row>
            <Row className="justify-content-end">
              <Button type="submit" className="btn-primary w-auto mt-3 mb-2">
                Submit
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
