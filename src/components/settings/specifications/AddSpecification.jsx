import React from "react";
import { useFormik } from "formik";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";

import ReactQuill from "react-quill";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";
import { AddNewSpecificationValidation } from "../../../commondata/formvalidations";

export default function AddSpecification({ show, hide }) {
  const initialValues = {
    product: "",
    message: "",
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewSpecificationValidation,
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
            Add Specifications
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
                  Product <span className="required_icon">*</span>
                </Form.Label>
                <Form.Select
                  type="text"
                  name="product"
                  placeholder="Select Attribute Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.product}
                >
                  <option value="select">Select</option>
                  <option value="product1">product1</option>
                  <option value="product2">product2</option>
                </Form.Select>

                {errors.product && touched.product ? (
                  <p className={`error`}>{errors.product}</p>
                ) : null}
              </Form.Group>

              <Form.Group as={Col} md="12">
                <Form.Label className="text-start">
                  Message <span className="required_icon">*</span>
                </Form.Label>
                <SunEditor
                  name="message"
                  setOptions={options_for_sunEditor}
                  onChange={(message) => setFieldValue("message", message)}
                  onBlur={() => setFieldTouched("message", true)}
                  value={values.message}
                />
                {errors.message && touched.message ? (
                  <p className={`error`}>{errors.message}</p>
                ) : null}
              </Form.Group>
            </Row>
            <Row className="justify-content-end mt-3 mb-2">
              <Button type="submit" className="btn-primary  w-auto">
                Submit
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
