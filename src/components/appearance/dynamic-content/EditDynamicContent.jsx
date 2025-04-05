import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useFormik } from "formik";
import { Link, useLocation } from "react-router-dom";
import { AddDynamicContentValidation } from "../../../commondata/formvalidations";
import bannerImage from "../../../assets/images/dashboard/image 144.png";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";
import SunEditor from "suneditor-react";
import slugify from "slugify";
import SeoForm from "../../seo-page/SeoForm"

const initialValues = {
  type: "test templte",
  banner_image: bannerImage,
  slug: "",
  content: "hello world",
  meta_title: "lorem ipsium",
  meta_description: "lorem ipsium",
  meta_keywords: "lorem ipsium",
  og_tag: "lorem ipsium",
  schema_markup: "lorem ipsium",
};

export default function EditDynamicContent() {
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
  const handleDynamicontent = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };
  useEffect(() => {
    generateSlug(values.type);
  }, [values.type]);
  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active={["Edit / "]}
            items={["Home", "Dynamic Content List"]}
            links={["/dashboard", "", "/appearance/dynamic-content"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/appearance/dynamic-content"
            className="btn btn-success text-white me-3"
          >
            View All Dynamic Content
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              {/* <h3 className="card-title">Edit Dynamic Content</h3> */}
            </Card.Header>
            <Card.Body className="add_new_product">
              <Form onSubmit={handleSubmit} className="add_category_form">
                <Row className="mb-4">
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Type <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="type"
                      onChange={handleDynamicontent}
                      onBlur={handleBlur}
                      value={values.type}
                    />
                    {errors.type && touched.type ? (
                      <p className={`error`}>{errors.type}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="8">
                    <Form.Label>
                      Banner Image (JPG,Jpeg,Png,2mb Size)
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      name="banner_image"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      Content <span className="text-danger">*</span>
                    </Form.Label>
                    <SunEditor
                      setOptions={options_for_sunEditor}
                      name="content"
                      onChange={(content) => setFieldValue("content", content)}
                      onBlur={() => setFieldTouched("content", true)}
                      setContents={values.content}
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
                </Row><Row className="mt-5">
                  <Button type="submit" className="btn-primary mx-auto w-auto">
                    Update
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
