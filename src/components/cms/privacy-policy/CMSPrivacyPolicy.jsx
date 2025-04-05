import React, { useEffect, useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import {
  Row, Card, Col, Button, Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import Suneditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import SeoForm from "../../seo-page/SeoForm"
import toast from "react-hot-toast";
import { useAddPrivacyPolicyMutation, useGetPrivacyPolicyQuery } from "../../../redux/features/cmsEndPoints";
import { PrivacyPolicyValidation } from "../../../commondata/formvalidations";
import Loader from "../../../layouts/layoutcomponents/loader";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";



export default function CMSPrivacyPolicy() {
  const [selectedThubnail, setSelectedThubnail] = useState(null);
  const [viewThubnail, setViewThubnail] = useState(true);
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetPrivacyPolicyQuery()
  const [addShippingPolicy, { isLoading: loading }] = useAddPrivacyPolicyMutation()

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showButton = role === "Admin" || role === "Staff" || permissions.Privacy_policy.includes("add")

  const initialValues = {
    page_title: "",
    heading: "",
    content: "",
    banner_image: "",
    video: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
    id: "",
    banner_status: true,
    banner_name: "",
    banner_link: ""
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
    validateForm
  } = useFormik({
    initialValues: initialValues,
    validationSchema: PrivacyPolicyValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await addShippingPolicy(formData);
        if (response?.data?.http_status_code == 201 || response?.data?.http_status_code == 200) {
          refetch()
          toast.success(response.data.message)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleScrollToError = async () => {
    const formErrors = await validateForm();
    const errorFields = Object.keys(formErrors);

    if (errorFields.length > 0) {
      const errorElement = document.getElementsByName(errorFields[0])[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
        errorElement.focus();
      }
    }
  };


  const singleCustomerSupportPolicy = data?.data[0]

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setFieldValue('banner_image', file)
    if (file) {
      setViewThubnail(false)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThubnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    setFieldValue("page_title", singleCustomerSupportPolicy?.page_title)
    setFieldValue("heading", singleCustomerSupportPolicy?.heading)
    setFieldValue("content", singleCustomerSupportPolicy?.content)
    setFieldValue("video", singleCustomerSupportPolicy?.video)
    setFieldValue("meta_title", singleCustomerSupportPolicy?.meta_title)
    setFieldValue("meta_description", singleCustomerSupportPolicy?.meta_description)
    setFieldValue("meta_keywords", singleCustomerSupportPolicy?.meta_keywords)
    setFieldValue("og_tag", singleCustomerSupportPolicy?.og_tag)
    setFieldValue("schema_markup", singleCustomerSupportPolicy?.schema_markup)
    setFieldValue("id", singleCustomerSupportPolicy?.id)
    setFieldValue("banner_image", singleCustomerSupportPolicy?.banner_image)
    setFieldValue("banner_status", singleCustomerSupportPolicy?.banner_status)
    setFieldValue("banner_name", singleCustomerSupportPolicy?.banner_name)
    setFieldValue("banner_link", singleCustomerSupportPolicy?.banner_link)
  }, [isSuccess])


  const generateOgTag = () => {
    let mainImage;
    const completeImage = values.banner_image.startsWith("http")

    if (!singleCustomerSupportPolicy?.banner_image) {
      mainImage = `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`
    } else {
      if (!completeImage) {
        mainImage = `${MEDIA_BASE_URL}/${values.banner_image}`
      } else {
        mainImage = `${values.banner_image}`
      }
    }
    const ogTag = `<meta property="og:type" content="website"><meta property="og:title" content='${values.meta_title || "undefined"}'><meta property="og:description" content="${values.meta_description || "undefined"}"><meta property="og:url" content="${USER_BASE_URL}contact-us"><meta property="og:site_name" content="Magicine Pharma"><meta property="og:image" content="${mainImage}">`
    setFieldValue("og_tag", ogTag)
  }

  useEffect(() => {
    if (values.meta_title && values.meta_description) {
      generateOgTag();
    }
  }, [values.meta_title, values.meta_description]);

  return (
    <>
      {isLoading && <Loader /> || loading && <Loader />}
      <Row className="justify-content-between">
        <Col>
          <PageHeader
            titles="CMS Page"
            active="Privacy Policy"
            items={["Home"]}
            links={["/dashboard"]}
          />
        </Col>

        <Col className="my-5 text-end">
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                handleScrollToError();
              }}>
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Page Title<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="page_title"
                        value={values.page_title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.page_title && touched.page_title ? (
                        <p className={`error`}>{errors.page_title}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Heading<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="heading"
                        value={values.heading}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.heading && touched.heading ? (
                        <p className={`error`}>{errors.heading}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Form.Label>
                        Content <span className="text-danger">*</span>
                      </Form.Label>
                      <Suneditor
                        name="content"
                        setOptions={options_for_sunEditor}
                        onChange={(content) =>
                          setFieldValue("content", content)
                        }

                        onBlur={() => setFieldTouched("content", true)}
                        setContents={values.content}
                      />
                      {errors.content && touched.content ? (
                        <p className={`error`}>{errors.content}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Row>
                        <Col as={Col} md={10}>
                          <Form.Label>Banner Image (JPEG, JPG, PNG, WEBP)</Form.Label>
                        </Col>
                        <Col as={Col} md={2} className="text-end mt-3">
                          <label className="custom-switch">
                            <input
                              type="checkbox"
                              name="banner_status"
                              className="custom-switch-input"
                              onChange={(e) => setFieldValue("banner_status", e.target.checked)}
                              onBlur={handleBlur}
                              checked={values.banner_status}
                            />
                            <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          {viewThubnail ? <div className="position-relative">
                            <Link to={"/view-images"} state={{ data: singleCustomerSupportPolicy?.banner_image }}><img src={singleCustomerSupportPolicy?.banner_image} alt="error" width={50} height={50} /></Link>
                            <span className="position-absolute">
                              <button className="p-0 px-1" onClick={() => { setViewThubnail(false), setFieldValue('banner_image', null) }}><i className="icon icon-close text-danger"></i></button>
                            </span>
                          </div> : (<div className="position-relative"><img src={selectedThubnail} alt="error" width={50} height={50} /></div>)}
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            name="banner_image"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                          />
                          {errors.banner_image && touched.banner_image ? (
                            <p className={`error`}>{errors.banner_image}</p>
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Banner Name</Form.Label>
                      <Form.Control
                        name="banner_name"
                        value={values?.banner_name}
                        onChange={handleChange}
                        onBlur={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Banner Link</Form.Label>
                      <Form.Control
                        name="banner_link"
                        value={values?.banner_link}
                        onChange={handleChange}
                        onBlur={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Video</Form.Label>
                      <Form.Control
                        type="url"
                        name="video"
                        value={values.video}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Col>
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
                <Row></Row>
                <Row className="mt-3 justify-content-center">
                  {showButton &&
                    (<Button type="submit" className="w-auto">
                      Save
                    </Button>)}
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}