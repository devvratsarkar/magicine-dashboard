import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Card,
  Dropdown,
} from "react-bootstrap";
import { useFormik } from "formik";
import { SystemSettingValidation } from "../../../commondata/formvalidations";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

const initialValues = {
  marketplace_name: "",
  legal_name: "",
  email_address: "",
  business_area: "",
  country: "",
  brand_logo: "",
  icon: "",
};
export default function SystemSettings() {
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
    validationSchema: SystemSettingValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <PageHeader
        titles="Settings"
        active="System Settings"
        items={["Home"]}
        links={["/dashboard"]}
      />
      <Row>
        <Col>
          <Card>
            <Card.Body className="edit_product">
              <Form onSubmit={handleSubmit} className="add_category_form">
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Marketplace Name <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="marketplace_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.marketplace_name}
                    />
                    {errors.marketplace_name && touched.marketplace_name ? (
                      <p className={`error`}>{errors.marketplace_name}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Legal Name <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="legal_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.legal_name}
                    />
                    {errors.legal_name && touched.legal_name ? (
                      <p className={`error`}>{errors.legal_name}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Email Address <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email_address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email_address}
                    />
                    {errors.email_address && touched.email_address ? (
                      <p className={`error`}>{errors.email_address}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Business Area <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Select
                      type="text"
                      name="business_area"
                      placeholder="Select Attribute Type"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.business_area}
                    >
                      <option value="select">Select</option>
                      <option value="business_area">business_area1</option>
                      <option value="business_area2">business_area2</option>
                    </Form.Select>

                    {errors.business_area && touched.business_area ? (
                      <p className={`error`}>{errors.business_area}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>
                      Country <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Select
                      type="select"
                      name="country"
                      placeholder="Select Attribute Type"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.country}
                    >
                      <option value="select">Select</option>
                      <option value="country1">India</option>
                      <option value="country2">Australia</option>
                      <option value="country3">America</option>
                    </Form.Select>

                    {errors.country && touched.country ? (
                      <p className={`error`}>{errors.country}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Brand Logo</Form.Label>
                    <Form.Control
                      type="file"
                      name="brand_logo"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.brand_logo}
                    />
                    {errors.brand_logo && touched.brand_logo ? (
                      <p className={`error`}>{errors.brand_logo}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Icon</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      name="icon"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.icon}
                    />
                    {errors.icon && touched.icon ? (
                      <p className={`error`}>{errors.icon}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mt-2">
                  <Button type="submit" className="btn-primary mx-auto w-auto">
                    Submit
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
