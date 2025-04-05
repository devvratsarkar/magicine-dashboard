import React, { useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { ReviewValidations } from "../../commondata/formvalidations";
import { useFormik } from "formik";
import { useGetSingleReviewQuery } from "../../redux/features/catalogueEndPoints";
import moment from "moment";

export default function ViewReview() {
  // const navigate = useNavigate();
  const { TYPE, PRODUCTID, ID } = useParams()
  const { data, isSuccess } = useGetSingleReviewQuery(ID)

  const initialValues = {
    customer: "",
    product: "",
    star_rating: "",
    createdAt: "",
    text_content: ""

  }


  const extractText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
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
    validationSchema: ReviewValidations,
    // onSubmit: async (values) => {
    //   // console.log("Form submitted with values:", values);
    // },
  });

  const singleReview = data?.data?.reviews || []


  useEffect(() => {
    setFieldValue("product", singleReview?.product?.product_name)
    setFieldValue("customer", singleReview?.customer?.name || singleReview?.customer_name)
    setFieldValue("star_rating", singleReview?.star_rating)
    setFieldValue("createdAt", singleReview?.createdAt)
    setFieldValue("text_content", singleReview?.text_content)
  }, [isSuccess])

  return (
    <div>
      <Row>
        <Col>
          <PageHeader
            titles="Reviews"
            active={["View/"]}
            items={["Home", "Review List", "product Reviews"]}
            links={["/dashboard", "/reviews", `/product-reviews/${TYPE}/${PRODUCTID}`]}
          />
        </Col>
        <Col className="d-grid text-end align-items-center">
          <div>
            <Button className="btn btn-success text-white me-3" variant="" >
              View product Reviews
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">View Review</h3>
            </Card.Header>
            <Card.Body className="add_new_product_name">
              <Form>
                <Row className="mb-6">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="customer"
                      value={values.customer}
                      className="border-0"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="product"
                      value={values.product}
                      className="border-0"
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Star Rating</Form.Label>
                    <div className="d-flex align-items-center">
                      <Box sx={{ "& > legend": { mt: 4 } }}>
                        <Rating
                          name="read-only"
                          className="Rating"
                          value={values.star_rating}
                          readOnly
                        />
                      </Box>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Reviewed On</Form.Label>
                    <Form.Control
                      type="text"
                      name="createdAt"
                      value={values && values.createdAt ? moment(values.createdAt).format("DD-MM-YYYY [at] hh:mm A") : null}
                      className="border-0"
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-6">
                  <Form.Group as={Col} md="12">
                    <Form.Label className="text-start">Comments</Form.Label>
                    <textarea
                      value={extractText(values.text_content)}
                      className="form-control mb-4 border-0"
                      rows="3"
                      name="text_content"
                      readOnly={true}
                    />
                  </Form.Group>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
