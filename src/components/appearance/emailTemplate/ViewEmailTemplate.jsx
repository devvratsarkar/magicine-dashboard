import React, { useRef } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import bannerImage from "../../../assets/images/dashboard/image 144.png";
import { Link, useLocation } from "react-router-dom";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import { useFormik } from "formik";
import { AddEmailTemplateValidation } from "../../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useLocale } from "antd/es/locale";

const initialValues = {
  name: "test template",
  template_type: "plain text",
  template_for: "website",
  status: "Active",
  sender_name: "Rahul Sharma",
  sender_email: "rahulSharma123@gmail.com",
  subject: "testing",
  short_codes: "123456",
  body: "hello world",
};

export default function ViewEmailTemplate() {
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
  const fileInputRef = useRef(null);
  const handleBannerClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active={["View"]}
            items={["Home", "Email Template"]}
            links={["/dashboard", "/appearance/email-template"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/appearance/email-template"
            className="btn btn-success text-white me-3"
          >
            View All Templates
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              {/* <h3 className="card-title">View Email Template</h3> */}
            </Card.Header>
            <Card.Body className="add_new_product">
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
                      readOnly={true}
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
                      readOnly={true}
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
                      readOnly={true}
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
                      as="select"
                      disabled
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
                      readOnly={true}
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
                      readOnly={true}
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
                      readOnly={true}
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
                      readOnly={true}
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
                      readOnly={true}
                      setContents={values.body}
                    />
                    {errors.body && touched.body ? (
                      <p className={`error`}>{errors.body}</p>
                    ) : null}
                  </Form.Group>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
