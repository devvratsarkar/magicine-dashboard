import React, { useRef, useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import bannerImage from "../../../assets/images/dashboard/image 144.png";
import { Link, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { AddNewPageValidation } from "../../../commondata/formvalidations";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import SeoForm from "../../seo-page/SeoForm"

const initialValues = {
  page_title: "Landing Page",
  page_type: "Home Page",
  banner_image: bannerImage,
  status: "active",
  slug: "",
  content: "hello this is rohit joshi",
  meta_title: "lorem ipsium",
  meta_description: "lorem",
  og_tag: "lorem ipsium",
  schema_markup: "lorem ipsium"
};

export default function EditPage() {
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

  useEffect(() => {
    generateSlug(values.page_title);
  }, [values.page_title]);

  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Appearance"
            active={["Edit Page / "]}
            items={["Home", "Page List"]}
            links={["/dashboard", "/appearance/page"]}
          />
        </Col>
        <Col className="text-end">
          <Link
            to="/appearance/page"
            className="btn btn-success text-white me-3"
          >
            View All Page
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              {/* <h3 className="card-title">Edit Page</h3> */}
            </Card.Header>
            <Card.Body className="add_new_product">
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
                      Banner Image (JPG,JPEG,PNG)
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <Row>
                      <Col as={Col} md={3}>
                        <img src={bannerImage} alt="bannerimage" />
                      </Col>
                      <Col as={Col} md={9}>
                        <Form.Control
                          type="file"
                          name="banner_image"
                          accept=".jpg,.jpeg,.png,.webp"
                          placeholder={values.banner_image}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></Form.Control>
                        {errors.banner_image && touched.banner_image ? (
                          <p className={"error"}>{errors.banner_image}</p>
                        ) : null}
                      </Col>
                    </Row>
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
                    {errors.slug && touched.slug ? (
                      <p className={`error`}>{errors.slug}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mb-6">
                  <Form.Label>
                    Content <span className="required_icon">*</span>
                  </Form.Label>
                  <Form.Group as={Col}>
                    <SunEditor
                      name="content"
                      setContents={values.content}
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
