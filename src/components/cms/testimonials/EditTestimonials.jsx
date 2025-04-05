import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AddTestimonialsValidation } from "../../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";
import bannerImage from "../../../assets/images/dashboard/image 144.png";
import { useGetTestimonialsIDQuery, useGetTestimonialsQuery, useUpdateTestimonialsMutation } from "../../../redux/features/cmsEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";

const initialValues = {
  customer_name: "",
  rating: null,
  image: bannerImage,
  status: true,
  designation: "",
  content: "",
};

export default function EditTestimonials() {
  const [selectedThubnail, setSelectedThubnail] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const [viewThubnail, setViewThubnail] = useState(true);
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetTestimonialsIDQuery(id)
  const { refetch: fetchAllTestimonial } = useGetTestimonialsQuery()
  const [updateTestimonials, { isLoading: loading }] = useUpdateTestimonialsMutation()
  // console.log(data?.data?.testimonial);
  const singleTestimonials = data?.data?.testimonial
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
      console.log(values);
      const formType = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formType.append(key, value);
      });
      try {
        const response = await updateTestimonials({ formType: formType, testimonialID: id });
        // console.log(response.data.message);
        if (response?.data?.http_status_code === 200) {
          console.log("response", response);
          toast.success(response?.data?.message)
          refetch()
          fetchAllTestimonial()
          navigate(`/cms/testimonials`)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });


  useEffect(() => {
    setFieldValue("customer_name", singleTestimonials?.customer_name)
    setFieldValue("image", singleTestimonials?.image)
    setFieldValue("rating", singleTestimonials?.rating)
    setFieldValue("content", singleTestimonials?.content)
    setFieldValue("designation", singleTestimonials?.designation)
    setFieldValue("status", singleTestimonials?.status)
  }, [isSuccess])


  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      setFieldValue("image", file);
      setViewThubnail(false)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThubnail(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
      e.target.value = null;
    }

    // if (file) {

    // }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }
  if (isSuccess) {
    return (
      <>{loading && <Loader />}

        <Row className="align-items-center">
          <Col className="text-start">
            <PageHeader
              titles="Appearance"
              active={["Edit Testimonials/"]}
              items={["Home", "Testimonial List"]}
              links={["/dashboard", "/cms/testimonials"]}
            />
          </Col>
          <Col className="text-end">
            <Link
              to="/cms/testimonials"
              className="btn btn-success text-white me-3"
            >
              View All Testimonials
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
            <Card>
              <Card.Body className="add_new_product">
                <Form onSubmit={handleSubmit} className="add_category_form">
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Customer Name <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        title="text"
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
                      />
                      {errors.rating && touched.rating ? (
                        <p className={`error`}>{errors.rating}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row className="mb-6">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        File (JPG,JPEG,PNG,2mb Size)
                        <span className="required_icon">*</span>
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          {viewThubnail ? <div className="position-relative">
                            <Link to={"/view-images"}><img src={singleTestimonials?.image} alt="error" width={50} height={50} /></Link>
                            <span className="position-absolute">
                              <button className="p-0 px-1" onClick={() => { setViewThubnail(false), setFieldValue('image', null) }}><i className="icon icon-close text-danger"></i></button>
                            </span>
                          </div> : (<div className="position-relative"><img src={selectedThubnail} alt="error" width={50} height={50} /></div>)}
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            name="image"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                          />
                          {errors.image && touched.image ? (
                            <p className={`error`}>{errors.image}</p>
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Status <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Select
                        name="status"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.status}
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
                        <Form.Control name="designation" value={values.designation} onChange={handleChange} onBlur={handleBlur} placeholder="Designation" />
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
                        setContents={values.content}
                        setOptions={options_for_sunEditor}
                      />
                      {errors.content && touched.content ? (
                        <p className={`error`}>{errors.content}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row>
                    <Button
                      type="submit"
                      className="btn-primary mx-auto w-auto"
                    >
                      Update
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
}
