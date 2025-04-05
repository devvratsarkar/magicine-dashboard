import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Dropdown } from "react-bootstrap";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import { AddEmailTemplateValidation } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";



export default function AddNewEmailTemplateForm() {
  const initialValues = {
    name: "",
    template_type: "",
    template_for: "",
    status: "",
    sender_name: "",
    sender_email: "",
    subject: "",
    short_codes: "",
    body: "",
  };
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
    validationSchema: AddEmailTemplateValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <Form onSubmit={handleSubmit} className="add_category_form">
        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Name <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.name && touched.name ? (
              <p className={`error`}>{errors.name}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Template Type <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="template_type"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.template_type}
            />
            {errors.template_type && touched.template_type ? (
              <p className={`error`}>{errors.template_type}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Template For <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="template_for"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.template_for}
            />
            {errors.template_for && touched.template_for ? (
              <p className={`error`}>{errors.template_for}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Status <span className="required_icon">*</span>
            </Form.Label>
            <Form.Select
              name="status"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.status}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
            {errors.status && touched.status ? (
              <p className={`error`}>{errors.status}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Sender Name <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="sender_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.sender_name}
            />
            {errors.sender_name && touched.sender_name ? (
              <p className={`error`}>{errors.sender_name}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Sender Email <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="sender_email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.sender_email}
            />
            {errors.sender_email && touched.sender_email ? (
              <p className={`error`}>{errors.sender_email}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Subject <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.subject}
            />
            {errors.subject && touched.subject ? (
              <p className={`error`}>{errors.subject}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="8">
            <Form.Label>
              Short Code <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="short_codes"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.short_codes}
            />
            {errors.short_codes && touched.short_codes ? (
              <p className={`error`}>{errors.short_codes}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6"></Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="12">
            <Form.Label>
              Body <span className="required_icon">*</span>
            </Form.Label>
            <SunEditor
              setOptions={options_for_sunEditor}
              name="body"
              onChange={(body) => setFieldValue("body", body)}
              onBlur={() => setFieldTouched("body", true)}
              value={values.body}
            />
            {errors.body && touched.body ? (
              <p className={`error`}>{errors.body}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row>
          <Button type="submit" className="btn-primary mx-auto w-auto">
            Submit
          </Button>
        </Row>
      </Form>
    </>
  );
}
