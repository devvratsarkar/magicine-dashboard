import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useFormik } from "formik";
import slugify from "slugify";
import toast from "react-hot-toast";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AddCmsJobApplicatioValidation } from "../../../commondata/formvalidations";
import Loader from "../../../layouts/layoutcomponents/loader";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import { useAddJobPositionMutation, useGetJobPositionIdQuery, useGetJobPositionQuery, useUpdateJobPositionMutation } from "../../../redux/features/cmsEndPoints";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { getJobApplication } from "../../../utils/routes";

export default function EditJobPosition() {
    const navigate = useNavigate()
    const [viewThubnail, setViewThubnail] = useState(true);
    const [selectedThubnail, setSelectedThubnail] = useState(null);
    const { id } = useParams()
    const [updateJobPosition, { isLoading }] = useUpdateJobPositionMutation();
    const { refetch } = useGetJobPositionQuery();
    const { data, refetch: JobIdPosition, isSuccess } = useGetJobPositionIdQuery(id, { refetchOnMountOrArgChange: true });

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
        status: "",
        banner_image: ""
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: AddCmsJobApplicatioValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            try {
                const response = await updateJobPosition({ positionId: id, positionData: formData });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message);
                    refetch()
                    JobIdPosition()
                    resetForm();
                    navigate("/cms/job-position")

                }
            } catch (error) {
                console.error("Submission error:", error);
                toast.error("Error submitting form");
            }
        },
    });

    const singleJobPosition = data?.data || null


    useEffect(() => {
        setFieldValue("title", singleJobPosition?.title)
        setFieldValue("status", singleJobPosition?.status)
        setFieldValue("slug", singleJobPosition?.slug)
        setFieldValue("no_positions", singleJobPosition?.no_positions)
        setFieldValue("work_type", singleJobPosition?.work_type)
        setFieldValue("category", singleJobPosition?.category)
        setFieldValue("experience", singleJobPosition?.experience)
        setFieldValue("banner_image", singleJobPosition?.banner_image)
        setFieldValue("location", singleJobPosition?.location)
        setFieldValue("description", singleJobPosition?.description)
        setFieldValue("requirement", singleJobPosition?.requirement)

    }, [isSuccess])



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
    };




    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, setFieldTouched, resetForm } = formik;

    const generateSlug = (value) => {
        const slug = slugify(value, { lower: true });
        setFieldValue("slug", slug);
    };

    const handleJobTitleChange = (event) => {
        handleChange(event);
        generateSlug(event.target.value);
    };

    return (
        <>
            <Row className="align-items-center">
                <Col className="text-start">
                    <PageHeader titles="Edit New Job Position" active="Edit New Job Position" items={["Home", "Job Position"]} links={["/dashboard", "/cms/job-position"]} />
                </Col>
                <Col className="text-end">
                    <Link to={getJobApplication()} className="btn btn-success text-white me-3" >View All Job Position</Link>
                </Col>
            </Row>
            <Row>
                <Col as={Col} md={12}>

                    <Card>
                        <Card.Header>Edit Job Application</Card.Header>
                        <Card.Body>
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
                                                value={values.status}
                                                onChange={handleChange}
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
                                            <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                            <Row>
                                                <Col as={Col} md={3} className="d-flex justify-content-center" >
                                                    {viewThubnail ? <div className="position-relative">
                                                        <Link><img src={singleJobPosition?.banner_image} alt="error" width={50} height={50} /></Link>
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
                                            // value={values.description}
                                            setContents={values.description}
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
                                            // value={values.requirement}
                                            setContents={values.requirement}
                                        />
                                    </Form.Group>
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


        </>
    );
}
