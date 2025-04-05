import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import PageHeader from "../../../../layouts/layoutcomponents/pageheader";
import { AddBlogsCategoryValidation } from "../../../../commondata/formvalidations";
import { getBlogCategoriesPage } from "../../../../utils/routes";
import { useEditBlogCategoryMutation, useGetAllBlogsCategoryQuery, useGetParentChildBlogsCategoryQuery, useGetSingleBlogsCategoryQuery } from "../../../../redux/features/blogsEndPoints";
import Loader from "../../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { TreeSelect } from "antd";

export default function AddBlogCategories() {
    const { id } = useParams();
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [editBlogCategory, { isLoading: loading }] = useEditBlogCategoryMutation();
    const { data, isError, error, isLoading: loadingCategory, isFetching, isSuccess, refetch: singleBlogCategory } = useGetSingleBlogsCategoryQuery(id);
    const { refetch } = useGetAllBlogsCategoryQuery();
    const { data: parentChildCategory } = useGetParentChildBlogsCategoryQuery();
    const parentChildCategoryData = parentChildCategory?.context?.data;
    const categoryData = data?.data;
    const navigate = useNavigate();

    const initialValues = {
        name: "",
        slug: "",
        parent_category: "",
        description: "",
        banner_image: ""
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched } = useFormik({
        initialValues: initialValues,
        validationSchema: AddBlogsCategoryValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });

            try {
                const response = await editBlogCategory({ blogCategoryData: formData, categoryId: id });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message);
                    singleBlogCategory()
                    refetch();
                    navigate(getBlogCategoriesPage());
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    // Handle thumbnail and file preview
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
        }
    };

    // Generate slug from category name
    const generateSlug = (name) => {
        const slug = slugify(name, { lower: true });
        setFieldValue("slug", slug);
    };

    const handleCategorySlug = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };

    useEffect(() => {
        if (categoryData) {
            setFieldValue("name", categoryData?.name || "");
            setFieldValue("slug", categoryData?.slug || "");
            setFieldValue("parent_category", categoryData?.parent_category?.id || "");
            setFieldValue("banner_image", categoryData?.banner_image || "");
        }
    }, [isSuccess, categoryData, setFieldValue]);

    if (loadingCategory || isFetching || loading) {
        return <Loader />;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles="Edit Blog Category" active={["Edit Blog Category"]} items={["Home", "Blog Categories List"]} links={["/dashboard", "/blogs/categories"]} />
                </Col>
                <Col className="text-end">
                    <Link to={getBlogCategoriesPage()} className="btn btn-success text-white me-3">View All Categories</Link>
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Body className="add_new_product">
                        <Form onSubmit={handleSubmit} className="add_category_form">
                            <Row className="mb-4">
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Name <span className="required_icon">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            onChange={handleCategorySlug}
                                            onBlur={handleBlur}
                                            value={values.name}
                                        />
                                        {errors.name && touched.name && <p className="error">{errors.name}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Slug <span className="required_icon">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="slug"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.slug}
                                        />
                                        {errors.slug && touched.slug && <p className="error">{errors.slug}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Parent Category</Form.Label>
                                        <TreeSelect
                                            className="w-100"
                                            value={values.parent_category}
                                            name="parent_category"
                                            onChange={(value) => setFieldValue("parent_category", value)}
                                            onBlur={handleBlur}
                                            showSearch
                                            treeData={parentChildCategoryData}
                                        />
                                        {errors.parent_category && touched.parent_category && <p className="error">{errors.parent_category}</p>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                        <Row>
                                            <Col md={3} className="d-flex justify-content-center">
                                                {viewThumbnail ? (
                                                    <div className="position-relative">
                                                        <img src={categoryData?.banner_image} alt="Banner" width={50} height={50} />
                                                        <button className="p-0 px-1 position-absolute" onClick={() => { setViewThumbnail(false); setFieldValue('banner_image', null); }}>
                                                            <i className="icon icon-close text-danger"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <img src={selectedThumbnail} alt="Thumbnail" width={50} height={50} />
                                                )}
                                            </Col>
                                            <Col md={9}>
                                                <Form.Control
                                                    type="file"
                                                    name="banner_image"
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    onChange={handleThumbnailChange}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.banner_image && touched.banner_image && <p className="text-danger">{errors.banner_image}</p>}
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <SunEditor onChange={(content) => setFieldValue("description", content)} onBlur={() => setFieldTouched("description", true)} setContents={categoryData?.description || ""} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Button type="submit" className="btn-primary mx-auto w-auto">Update</Button>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}
