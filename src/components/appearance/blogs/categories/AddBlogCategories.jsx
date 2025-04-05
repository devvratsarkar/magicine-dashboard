import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import TagInput from "rsuite/TagInput";
import { TreeSelect } from "antd";
import PageHeader from "../../../../layouts/layoutcomponents/pageheader";
import { AddBlogsCategoryValidation } from "../../../../commondata/formvalidations";
import { getBlogCategoriesPage } from "../../../../utils/routes";
import { useAddNewBlogCategoryMutation, useGetAllBlogsCategoryQuery, useGetParentChildBlogsCategoryQuery } from "../../../../redux/features/blogsEndPoints";
import Loader from "../../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";


export default function AddBlogCategories() {
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [addNewBlogCategory, { isLoading }] = useAddNewBlogCategoryMutation()
    const { refetch } = useGetAllBlogsCategoryQuery()
    const { data: parentChildCategory } = useGetParentChildBlogsCategoryQuery()
    const parentChildCategoryData = parentChildCategory?.context?.data;
    const navigate = useNavigate()
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
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'banner_image') {
                    formData.append('banner_image', value);
                } else {
                    formData.append(key, value);
                }
            });

            try {
                const response = await addNewBlogCategory(formData);
                if (response?.data?.http_status_code === 201) {
                    toast.success(response.data.message)
                    refetch()
                    navigate(`${getBlogCategoriesPage()}`)
                }
            } catch (error) {
                console.error(error);
            }
        },
    });


    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        setFieldValue('banner_image', file);

        if (file) {
            setViewThumbnail(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setViewThumbnail(true);
            setSelectedThumbnail(null);
        }
    };



    const generateSlug = (values) => {
        const slug = slugify(values, { lower: true });
        setFieldValue("slug", slug);
    };
    const handleCategorySlug = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };
    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles="Add New Categories" active={["add new categories"]} items={["Home", "Blog Categories List"]} links={["/dashboard", "/blogs/categories"]} />
                </Col>
                <Col className="text-end">
                    <Link to={`${getBlogCategoriesPage()}`} className="btn btn-success text-white me-3" >View All Categories</Link>
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Body className="add_new_product">
                        <Form onSubmit={handleSubmit} className="add_category_form">
                            {isLoading && <Loader />}
                            <Row className="mb-5">
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
                                        />
                                        {errors.slug && touched.slug ? (
                                            <p className={`error`}>{errors.slug}</p>
                                        ) : null}
                                    </Form.Group>
                                </Col>
                                <Col as={Col} md="6">
                                    <Form.Group>
                                        <Form.Label>
                                            Parent Category
                                        </Form.Label>
                                        <TreeSelect
                                            className="w-100"
                                            value={values.parent_category}
                                            name="parent_category"
                                            onChange={(value) => { handleChange({ target: { name: "parent_category", value }, }); }}
                                            onBlur={handleBlur}
                                            showSearch
                                            treeData={parentChildCategoryData}
                                        ></TreeSelect>
                                        {errors.parent_category && touched.parent_category ? (
                                            <p className={`error`}>{errors.parent_category}</p>
                                        ) : null}
                                    </Form.Group>
                                </Col>
                                <Col as={Col} md={6}>
                                    <Form.Group>
                                        <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                        <Row>
                                            <Col as={Col} md={3} className="d-flex justify-content-center">
                                                {viewThumbnail ? (
                                                    <div className="position-relative">
                                                        <p>No image</p>
                                                        <span className="position-absolute">
                                                            <button className="p-0 px-1" onClick={() => { setViewThumbnail(true), setFieldValue('banner_image', null) }}>
                                                                <i className="icon icon-close text-danger"></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="position-relative">
                                                        <img src={selectedThumbnail} alt="Selected Thumbnail" width={50} height={50} />
                                                        <span className="position-absolute">
                                                            <button className="p-0 px-1" onClick={() => { setViewThumbnail(true), setFieldValue('banner_image', null) }}>
                                                                <i className="icon icon-close text-danger"></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                )}
                                            </Col>
                                            <Col as={Col} md={9}>
                                                <Form.Control
                                                    type="file"
                                                    name="banner_image"
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    onChange={handleThumbnailChange}
                                                    onBlur={handleBlur}
                                                />
                                                {
                                                    errors.banner_image && touched.banner_image ? (
                                                        <p className="text-danger">{errors.banner_image}</p>
                                                    ) : null
                                                }
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col as={Col}>
                                    <Form.Group>
                                        <Form.Label>
                                            Description
                                        </Form.Label>

                                        <SunEditor onChange={(content) => setFieldValue("description", content)} onBlur={() => setFieldTouched("description", true)} name="description" setContents={values.description} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Button type="submit" className="btn-primary mx-auto w-auto" >Save</Button>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}
