import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Dropdown } from "react-bootstrap";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import { AddTestimonialsValidation } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useAddTestimonialsMutation, useGetTestimonialsQuery } from "../../redux/features/cmsEndPoints";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import { useNavigate } from "react-router-dom";


export default function AddTEstimonialsForm() {
  const navigate = useNavigate()
  const { refetch } = useGetTestimonialsQuery()
  const [AddTestimonials, { isLoading }] = useAddTestimonialsMutation()

  const initialValues = {
    customer_name: "",
    rating: null,
    image: "",
    status: true,
    content: "",
    designation: ""
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
    validationSchema: AddTestimonialsValidation,
    onSubmit: async (values) => {
      const formType = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        console.log(values);
        formType.append(key, value);
      });
      try {
        const response = await AddTestimonials(formType);
        console.log("response", response);
        if (response?.data?.http_status_code === 201) {
          toast.success(response?.data?.message)
          refetch()
          resetForm()
          navigate('/cms/testimonials')
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <>
      {isLoading && <Loader />}
      <Form onSubmit={handleSubmit} className="add_category_form">
        <Row className="mb-4">
          <Form.Group as={Col} md="6">
            <Form.Label>
              Customer Name <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              title="text"
              placeholder="Customer Name"
              name="customer_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.customer_name}
            />
            {errors.customer_name && touched.customer_name ? (
              <p className={`error`}>{errors.customer_name}</p>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} md="6">
            <Form.Label>
              Rating <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="rating"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.rating}
              min={1}
              max={5}
            />
            {errors.rating && touched.rating ? (
              <p className={`error`}>{errors.rating}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="6">
            <Form.Label>
              Image (JPG,JPEG,PNG,2mb Size)
              <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                  setFieldValue("image", file);
                } else {
                  toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                  e.target.value = null;
                }
              }}
              onBlur={handleBlur}
            />
            {errors.image && touched.image ? (
              <p className={`error`}>{errors.image}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>
              Status <span className="required_icon">*</span>
            </Form.Label>
            <Form.Select
              title="text"
              name="status"
              value={values.status.toString()}
              onChange={(e) => {
                const newStatus = e.target.value === 'true';
                handleChange({
                  target: {
                    name: "status",
                    value: newStatus,
                  }
                })
              }}
              onBlur={handleBlur}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
            {errors.status && touched.status ? (
              <p className={`error`}>{errors.status}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Designation <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={values.designation}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="designation"
              />
              {
                errors.designation && touched.designation ? (
                  <p className="error">{errors.designation}</p>
                ) : null
              }
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="12">
            <Form.Label>Content</Form.Label>
            <SunEditor
              name="content"
              onChange={(content) => setFieldValue("content", content)}
              onBlur={() => setFieldTouched("content", true)}
              value={values.content}
              setOptions={options_for_sunEditor}
              placeholder="Content"
            />
            {errors.content && touched.content ? (
              <p className={`error`}>{errors.content}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row>
          <Button
            title="submit"
            type="submit"
            className="btn-primary mx-auto w-auto"
          >
            Submit
          </Button>
        </Row>
      </Form >
    </>
  );
}
