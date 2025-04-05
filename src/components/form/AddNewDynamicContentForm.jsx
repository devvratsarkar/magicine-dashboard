import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Dropdown } from "react-bootstrap";
import { useFormik } from "formik";
import { AddDynamicContentValidation } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";
import SunEditor from "suneditor-react";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm"



export default function AddNewDynamicContentForm() {
  const initialValues = {
    type: "",
    banner_image: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
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
    validationSchema: AddDynamicContentValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const generateSlug = (values) => {
    const slug = slugify(values, { lower: true });
    setFieldValue("slug", slug);
  };

  const handleDynamicContentSlug = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="add_category_form">
        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Type <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="type"
              onChange={handleDynamicContentSlug}
              onBlur={handleBlur}
              value={values.type}
            />
            {errors.type && touched.type ? (
              <p className={`error`}>{errors.type}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="8">
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
              Slug <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="slug"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.slug}
            />
            {errors.slug && touched.slug ? (
              <p className={`error`}>{errors.slug}</p>
            ) : null}
          </Form.Group>

        </Row>

        <Row className="mb-6">
          <Form.Group as={Col} md="12">
            <Form.Label>
              Content <span className="required_icon">*</span>
            </Form.Label>
            <SunEditor
              name="content"
              setOptions={options_for_sunEditor}
              onChange={(content) => setFieldValue("content", content)}
              onBlur={() => setFieldTouched("content", true)}
              value={values.content}
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
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
}
