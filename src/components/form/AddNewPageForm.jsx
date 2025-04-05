import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import "react-quill/dist/quill.snow.css";
import { AddNewPageValidation } from "../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm"


export default function AddNewPageForm() {
  const [content, setContent] = useState("");

  const initialValues = {
    page_title: "",
    page_type: "",
    banner_image: "",
    status: "",
    content: "",
    meta_title: "",
    og_tag: "",
    meta_description: "",
    meta_keywords: "",
    schema_markup: "",
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
    validationSchema: AddNewPageValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };

  const handlePageNameChange = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="add_category_form">
        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Page Title <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="page_title"
              onChange={handlePageNameChange}
              onBlur={handleBlur}
              value={values.page_title}
              placeholder="Page Title"
            />
            {errors.page_title && touched.page_title ? (
              <p className={`error`}>{errors.page_title}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Page Type <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="page_type"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.page_type}
            />
            {errors.page_type && touched.page_type ? (
              <p className={`error`}>{errors.page_type}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Banner Image (JPG,JPEG,PNG,2mb Size)
              <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="file"
              name="banner_image"
              onChange={handleChange}
              accept=".jpg,.jpeg,.png,.webp"
              onBlur={handleBlur}
              value={values.banner_image}
            />
            {errors.banner_image && touched.banner_image ? (
              <p className={`error`}>{errors.banner_image}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Status <span className="required_icon">*</span>
            </Form.Label>
            <Form.Select
              type="text"
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
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              name="slug"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.slug}
            />
          </Form.Group>

        </Row>
        <Row className="mb-6">
          <Form.Group as={Col} md={12}>
            <Form.Label>
              Content <span className="required_icon">*</span>
            </Form.Label>
            <SunEditor
              name="content"
              value={values.content}
              onChange={(content) => setFieldValue("content", content)}
              onBlur={() => setFieldTouched("content", true)}
              setOptions={options_for_sunEditor}
            />
            {errors.content && touched.content ? (
              <p className={`error`}>{errors.content}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row>
          <SeoForm
            handleChange={handleChange}
            values={values}
            errors={errors}
            handleBlur={handleBlur}
            touched={touched}
            readOnlyStatus={false}
          />
        </Row>
        <Row className="mt-5">
          <Button type="submit" className="btn-primary mx-auto w-auto">
            Submit
          </Button>
        </Row>
      </Form>
    </>
  );
}
