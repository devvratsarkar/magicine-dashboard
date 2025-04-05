import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { AddCmsJobApplicatioValidation } from "../../commondata/formvalidations";
import slugify from "slugify";
import { useGetCategoryByParentChildQuery } from "../../redux/features/catalogueEndPoints";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import { useAddJobPositionMutation, useGetJobPositionQuery } from "../../redux/features/cmsEndPoints";
import { useNavigate } from "react-router-dom";

export default function AddJobPositionForm() {
    const navigate = useNavigate()
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [addJobPosition, { isLoading }] = useAddJobPositionMutation();
    const { refetch } = useGetJobPositionQuery();

    const initialValues = {
        title: "",
        slug: "",
        description: "",
        requirement: "",
        no_positions: "",
        location: "",
        category: "",
        work_type: "",
        experience: "",
        status: true,
        banner_image: ""
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, setFieldTouched, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: AddCmsJobApplicatioValidation,
        onSubmit: async (values, { resetForm }) => {
            console.log("values", values);
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });

            try {
                const response = await addJobPosition(formData);
                if (response?.data?.http_status_code === 201) {
                    toast.success(response.data.message);
                    refetch();
                    resetForm();
                    navigate("/cms/job-position");
                }
            } catch (error) {
                console.error("Submission error:", error);
                toast.error("Error submitting form");
            }
        },
    });



    const generateSlug = (value) => {
        const slug = slugify(value, { lower: true });
        setFieldValue("slug", slug);
    };

    const handleJobTitleChange = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };


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

    return (
        <Form onSubmit={handleSubmit} className="add_category_form">
            {isLoading && <Loader />}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Title <span className="required_icon">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            onChange={handleJobTitleChange}
                            onBlur={handleBlur}
                            value={values.title}
                        />
                        {errors.title && touched.title && <p className="error">{errors.title}</p>}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="status"
                            value={values.status.toString()}
                            onChange={(e) => {
                                const newValue = e.target.value === 'true';
                                setFieldValue("status", newValue);
                            }}
                            onBlur={handleBlur}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </Form.Select>
                        {errors.status && touched.status && <p className="error">{errors.status}</p>}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
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
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>No Of Positions <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="no_positions"
                            value={values.no_positions}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.no_positions && touched.no_positions && <p className="text-danger">{errors.no_positions}</p>}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Work Type <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="work_type"
                            value={values.work_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.work_type && touched.work_type && <p className="text-danger">{errors.work_type}</p>}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="category"
                            value={values.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.category && touched.category && <p className="text-danger">{errors.category}</p>}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Experience <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="experience"
                            value={values.experience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.experience && touched.experience && <p className="text-danger">{errors.experience}</p>}
                    </Form.Group>
                </Col>
                <Col as={Col} md={6}>
                    <Form.Group>
                        <Form.Label>Banner Inage <span className="text-danger">*</span></Form.Label>
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
                                {errors.banner_image && touched.banner_image ? (
                                    <p className={`error`}>{errors.banner_image}</p>
                                ) : null}
                            </Col>
                        </Row>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.location && touched.location && <p className="text-danger">{errors.location}</p>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col}>
                    <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                    <SunEditor
                        name="description"
                        onChange={(content) => setFieldValue("description", content)}
                        onBlur={() => setFieldTouched("description", true)}
                        setOptions={options_for_sunEditor}
                        value={values.description}
                    />
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col}>
                    <Form.Label>Requirement</Form.Label>
                    <SunEditor
                        name="requirement"
                        onChange={(content) => setFieldValue("requirement", content)}
                        onBlur={() => setFieldTouched("requirement", true)}
                        setOptions={options_for_sunEditor}
                        value={values.requirement}
                    />
                </Form.Group>
            </Row>
            <Row className="mt-5">
                <Button type="submit" className="btn-primary mx-auto w-auto">
                    Save
                </Button>
            </Row>
        </Form>
    );
}
