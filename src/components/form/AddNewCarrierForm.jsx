import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Dropdown } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewCarrierSchema } from "../../commondata/formvalidations";
import { useAddNewCarrierMutation, useGetAllCarrierQuery } from "../../redux/features/shippingZoneEndPoints";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getCarrierPage } from "../../utils/routes";
import Loader from "../../layouts/layoutcomponents/loader";

export default function AddNewCarrierForm() {
  const [addNewCarrier, { isLoading }] = useAddNewCarrierMutation()
  const { refetch } = useGetAllCarrierQuery()
  const navigate = useNavigate()
  const initialValues = {
    name: "",
    tracking_url: "",
    phone: "",
    email: "",
    logo: "",
    status: true,
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCarrierSchema,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await addNewCarrier(formData);
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          navigate(`${getCarrierPage()}`)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });


  return (
    <>
      <Form onSubmit={handleSubmit} className="add_category_form">
        {isLoading && <Loader />}
        <Row className="mb-4">
          <Form.Group as={Col} md="6">
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
          <Form.Group as={Col} md="6">
            <Form.Label>
              Tracking Url <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="url"
              name="tracking_url"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.tracking_url}
            />
            {errors.tracking_url && touched.tracking_url ? (
              <p className={`error`}>{errors.tracking_url}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="6">
            <Form.Label>
              Phone <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
            />
            {errors.phone && touched.phone ? (
              <p className={`error`}>{errors.phone}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>
              Email <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {errors.email && touched.email ? (
              <p className={`error`}>{errors.email}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="6">
            <Form.Label>Logo Only (JPG,JPEG,PNG, 2mb Size)</Form.Label>
            <Form.Control
              type="file"
              name="logo"
              onChange={(e) => setFieldValue('logo', e.target.files[0])}
              onBlur={handleBlur}
              accept=".jpg,.jpeg,.png,.webp"
            />
            {errors.logo && touched.logo ? (
              <p className={`error`}>{errors.logo}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Status</Form.Label>
            <Form.Group>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  name="status"
                  className="custom-switch-input"
                  checked={values.status}
                  onChange={(e) => {
                    setFieldValue("status", e.target.checked);
                  }}
                />
                <span className="custom-switch-indicator custum-green-btn"></span>
              </label>
            </Form.Group>
            {errors.status && touched.status ? (
              <p className={`error`}>{errors.status}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row>
          <Button type="submit" className="btn-primary mx-auto w-auto">
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
}
