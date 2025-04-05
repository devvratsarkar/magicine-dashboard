import React, { useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { ReviewValidations } from "../../commondata/formvalidations";
import { useFormik } from "formik";
import { useGetSelectedReviewsQuery, useGetSingleReviewQuery, useUpdateReviewMutation } from "../../redux/features/catalogueEndPoints";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";

export default function EditReview() {
    const navigate = useNavigate();
    const { TYPE, PRODUCTID, ID } = useParams();
    const { data, isSuccess, refetch } = useGetSingleReviewQuery(ID);
    const [updateReview, {isLoading}] = useUpdateReviewMutation();
    const { refetch: allproductReviews } = useGetSelectedReviewsQuery({ modelType: TYPE, productId: PRODUCTID });

    const initialValues = {
        customer: "",
        product: "",
        star_rating: 4,
        createdAt: "",
        text_content: "",
        customer_id: "",
        product_id: ""
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
        initialValues,
        validationSchema: "",
        // validationSchema: ReviewValidations,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("customer_id", values.customer_id);
            formData.append("product_id", values.product_id);
            formData.append("star_rating", values.star_rating);
            formData.append("text_content", values.text_content);

            try {
                const response = await updateReview({ reviewData: formData, ID });

                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message);
                    refetch();
                    allproductReviews()
                    navigate(`/product-reviews/${data?.data?.reviews?.modelType}/${data?.data?.reviews?.product?.id}`)
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    const singleReview = data?.data?.reviews || {};


    useEffect(() => {
        if (isSuccess && singleReview) {
            setFieldValue("product", singleReview?.product?.product_name);
            setFieldValue("customer", singleReview?.customer?.name);
            setFieldValue("star_rating", singleReview?.star_rating);
            setFieldValue("createdAt", singleReview?.createdAt);
            setFieldValue("text_content", singleReview?.text_content);
            setFieldValue("product_id", singleReview?.product?._id);
            setFieldValue("customer_id", singleReview?.customer?._id);
            setFieldValue("images", singleReview?.images);
            setFieldValue("slug", singleReview?.slug);
        }
    }, [isSuccess]);

    return (
        <>
            {
                isLoading && <Loader />
            }
            <div>
                <Row>
                    <Col>
                        <PageHeader
                            titles="Reviews"
                            active={["edit/"]}
                            items={["Home", "Review List", "Product Reviews"]}
                            links={["/dashboard", "/reviews", `/product-reviews/${TYPE}/${PRODUCTID}`]}
                        />
                    </Col>
                    {/* <Col className="d-grid text-end align-items-center">
                    <div>
                        <Button className="btn btn-success text-white me-3" variant="">
                            Edit Product Reviews
                        </Button>
                    </div>
                </Col> */}
                </Row>
                <Row>
                    <Col md={12} lg={12}>
                        <Card>
                            <Card.Header></Card.Header>
                            <Card.Body className="add_new_product_name">
                                <Form onSubmit={handleSubmit}>
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
                                            <Form.Label>Product Name</Form.Label>
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
                                                        name="star_rating"
                                                        value={values.star_rating}
                                                        onChange={(event, newValue) => setFieldValue('star_rating', newValue)}
                                                        onBlur={handleBlur}
                                                    />
                                                </Box>
                                            </div>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Reviewed On</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="createdAt"
                                                value={`${values.createdAt}`}
                                                className="border-0"
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-6">
                                        <Form.Group as={Col} md="12">
                                            <Form.Label className="text-start">Comments</Form.Label>
                                            <SunEditor
                                                className="form-control mb-4 border-0"
                                                rows="3"
                                                name="text_content"
                                                setOptions={options_for_sunEditor}
                                                setContents={values?.text_content}
                                                onChange={(content) => setFieldValue("text_content", content)}
                                                onBlur={() => setFieldTouched("text_content", true)}
                                            />
                                            {errors.text_content && (
                                                <div className="text-danger">{errors.text_content}</div>
                                            )}
                                        </Form.Group>
                                    </Row>

                                    <Row className="justify-content-center">
                                        <Button type="submit" className="w-auto">Update</Button>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}
