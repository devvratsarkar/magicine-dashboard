import React, { useEffect, useRef } from "react";
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

const initialValues = {
  page_title: "Landing Page",
  page_type: "Home Page",
  banner_image: bannerImage,
  status: "active",
  slug: "hello",
  content: "hello this is rohit joshi",
  meta_title: "lorem ipsium",
  meta_description: "lorem",
  og_tag: "lorem ipsium",
  schema_markup: "lorem ipsium",
};

export default function ViewPage() {
  const location = useLocation()
  const { name } = location.state.name
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

  const generateSlug = (values) => {
    const slug = slugify(values, { lower: true });
    setFieldValue("slug", slug);
  };

  const handlePageSlug = (event) => {
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
            active={["View Page/"]}
            items={["Home", "Page"]}
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
              {/* <h3 className="card-title">View Page</h3> */}
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
                      onChange={handlePageSlug}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.page_title}
                    />
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
                      readOnly={true}
                      value={values.page_type}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Banner Image (JPG,JPEG,PNG)
                      <span className="required_icon">*</span>
                    </Form.Label>

                    <img
                      src={values.banner_image}
                      alt="Product Image"
                      className={``}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Status <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Select
                      as="select"
                      type="text"
                      name="status"
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.status}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="meta_title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.meta_title}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="meta_description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.meta_description}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="4">
                    <Form.Label>Slug</Form.Label>
                    <Form.Control
                      type="text"
                      name="slug"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.slug}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>OG Tag</Form.Label>
                    <Form.Control
                      type="text"
                      name="og_tag"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.og_tag}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Schema Markup <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="schema_markup"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={true}
                      value={values.schema_markup}
                    />
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
                      readOnly
                      onChange={(content) => setFieldValue("content", content)}
                      onBlur={() => setFieldTouched("content", true)}
                      setOptions={options_for_sunEditor}
                    />
                  </Form.Group>
                </Row>
                <Row>
                <SeoForm
                    handleChange={handleChange}
                    values={values}
                    errors={errors}
                    handleBlur={handleBlur}
                    touched={touched}
                    readOnlyStatus={true}
                  />
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
