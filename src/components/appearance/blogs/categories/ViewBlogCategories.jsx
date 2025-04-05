import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { Link, useLocation, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import TagInput from "rsuite/TagInput";
import "rsuite/TagInput/styles/index.css";
import PageHeader from "../../../../layouts/layoutcomponents/pageheader";
import { AddBlogsCategoryValidation } from "../../../../commondata/formvalidations";
import { getBlogCategoriesPage } from "../../../../utils/routes";
import { useEditBlogCategoryMutation, useGetAllBlogsCategoryQuery, useGetParentChildBlogsCategoryQuery, useGetSingleBlogsCategoryQuery } from "../../../../redux/features/blogsEndPoints";
import Loader from "../../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { TreeSelect } from "antd";


export default function ViewBlogCategories() {
    const { id } = useParams()
    const [editBlogCategory, { isLoading: loading }] = useEditBlogCategoryMutation()
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetSingleBlogsCategoryQuery(id)
    const { refetch } = useGetAllBlogsCategoryQuery()
    const { data: parentChildCategory } = useGetParentChildBlogsCategoryQuery()
    const parentChildCategoryData = parentChildCategory?.context?.data;
    const categoryData = data?.data;
    const initialValues = {
        name: "",
        slug: "",
        parent_category: "",
        description: "",
        banner_image: ""
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: AddBlogsCategoryValidation,
        onSubmit: async (values) => {
            try {
                const response = await editBlogCategory({ blogCategoryData: values, categoryId: id });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message)
                    refetch()
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    const generateSlug = (values) => {
        const slug = slugify(values, { lower: true });
        setFieldValue("slug", slug);
    };
    const handleCategorySlug = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };
    useEffect(() => {
        setFieldValue("name", categoryData?.name)
        setFieldValue("slug", categoryData?.slug)
        setFieldValue("parent_category", categoryData?.parent_category?.id);
        setFieldValue("banner_image", categoryData?.banner_image);
    }, [isSuccess])
    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }
    if (isSuccess) {
        return (
            <>
                <Row className="align-items-center">
                    <Col className="text-start">
                        <PageHeader titles="View Blog Category" active={["Edit blog category"]} items={["Home", "Blog Categories List"]} links={["/dashboard", "/blogs/categories"]} />
                    </Col>
                    <Col className="text-end">
                        <Link to={`${getBlogCategoriesPage()}`} className="btn btn-success text-white me-3" >View All Categories</Link>
                    </Col>
                </Row>
                <Row>
                    <Card>
                        <Card.Body className="add_new_product">
                            <Form onSubmit={handleSubmit} className="add_category_form">
                                {isLoading && <Loader /> || loading && <Loader />}
                                <Row className="mb-4">
                                    <Col as={Col} md="6">
                                        <Form.Group>
                                            <Form.Label>
                                                Name <span className="required_icon">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                title="text"
                                                name="name"
                                                onChange={handleCategorySlug}
                                                onBlur={handleBlur}
                                                value={values.name}
                                                readOnly
                                            />
                                            {errors.name && touched.name ? (
                                                <p className={`error`}>{errors.name}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md="6">
                                        <Form.Group>
                                            <Form.Label>
                                                Slug <span className="required_icon">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                title="text"
                                                name="slug"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.slug}
                                                readOnly
                                            />
                                            {errors.slug && touched.slug ? (
                                                <p className={`error`}>{errors.slug}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md="6">
                                        <Form.Group>
                                            <Form.Label>Parent Category</Form.Label>
                                            <TreeSelect
                                                className="w-100"
                                                value={values.parent_category}
                                                name="parent_category"
                                                onChange={(value) => { handleChange({ target: { name: "parent_category", value }, }); }}
                                                onBlur={handleBlur}
                                                showSearch
                                                treeData={parentChildCategoryData}
                                                disabled
                                            ></TreeSelect>
                                            {errors.parent_category && touched.parent_category ? (
                                                <p className={`error`}>{errors.parent_category}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                            <img src={categoryData?.banner_image} alt="error" width={75} height={75} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col as={Col}>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <SunEditor readOnly onChange={(content) => setFieldValue("description", content)} onBlur={() => setFieldTouched("description", true)} name="description" setContents={categoryData?.description} disable />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Button type="submit" className="btn-primary mx-auto w-auto" >Save</Button>
                                </Row> */}
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </>
        );
    }
}
