import React, { useEffect, useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, Form, } from "react-bootstrap";
import { useFormik } from "formik";
import "suneditor/dist/css/suneditor.min.css";
import SeoForm from "../../seo-page/SeoForm"
import { useAddCareerPageMutation, useGetCareerPageQuery } from "../../../redux/features/cmsEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { CareerPageValidation } from "../../../commondata/formvalidations";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";
export default function Careers() {

    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetCareerPageQuery()
    const getCareerData = data?.data[0]
    const [addCareer, { isLoading: loading }] = useAddCareerPageMutation()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))
    const showAdd = role === "Admin" || role === "Staff" && permissions.Career.includes("add")

    const [readOnlyFields, setReadOnlyFields] = useState({
        section_two_name: true,
        section_three_name: true,
        section_four_name: true,
    })


    const handleEditClick = (field) => {
        setReadOnlyFields((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    const initialValues = {
        section_one: {
            status: true,
            banner_text: "",
        },
        section_two: {
            status: true,
            name: 'Our Value Culture',
            box_one_heading: '',
            box_one_text: '',
            box_two_heading: '',
            box_two_text: '',
            box_three_heading: '',
            box_three_text: '',
        },
        section_three: {
            name: "Perks And Benefits?",
            status: true,
            box_one_text: "",
            box_two_text: "",
            box_three_text: "",
            box_four_text: "",
        },
        section_four: {
            name: "Who We Aspire To Become",
            status: true,
            text: "",
        },

        image_one: "",
        image_two: "",
        image_three: "",
        image_four: "",
        image_five: "",
        image_six: "",
        image_seven: "",
        image_eight: "",
        image_nine: "",
        image_ten: "",


        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
        id: ""
    };
    const { values, handleChange, handleSubmit, handleBlur, setFieldValue, errors, touched, resetForm, validateForm } = useFormik({
        initialValues,
        validationSchema: CareerPageValidation,
        onSubmit: async (values) => {
            const formData = new FormData();

            const appendFormData = (formData, data, parentKey) => {
                if (data && typeof data === 'object' && !(data instanceof File)) {
                    Object.entries(data).forEach(([key, value]) => {
                        appendFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key);
                    });
                } else {
                    if (data !== null && data !== "") {
                        formData.append(parentKey, data);
                    }
                }
            };

            appendFormData(formData, values);

            try {
                const response = await addCareer(formData);
                if (response?.data?.http_status_code === 201 || response?.data?.http_status_code === 200) {
                    refetch()
                    toast.success(response.data.message);
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

    useEffect(() => {
        if (isSuccess && data?.data?.length > 0) {
            const getCareer = data.data[0];
            Object.keys(initialValues).forEach((key) => {
                if (getCareer[key] !== undefined) {
                    setFieldValue(key, getCareer[key]);
                }
            });
        }
        setFieldValue("image_one", getCareerData?.section_one?.banner_image)
        setFieldValue("image_five", getCareerData?.section_three?.banner_image)
        setFieldValue("image_ten", getCareerData?.section_four?.banner_image)
        setFieldValue("id", getCareerData?.id)
    }, [isSuccess, data, setFieldValue]);


    const generateOgTag = () => {
        let mainImage;
        const completeImage = values.image_one.startsWith("http")
        if (!getCareerData?.section_one?.banner_image) {
            mainImage = `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`
        } else {
            if (!completeImage) {
                mainImage = `${MEDIA_BASE_URL}/${values.image_one}`
            } else {
                mainImage = `${values.image_one}`
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
            {loading && <Loader /> || isLoading && <Loader />}
            <Row className="justify-content-between">
                <Col>
                    <PageHeader names="CMS- Careers" active="Career" items={["Home", "CMS",]} links={["/dashboard"]} />
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
                                <Row className="mb-4">
                                    <Col as={Col} md={6}>
                                        <p className="text-primary fs-6 ">Section 1</p>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="section_one.status"
                                                className="custom-switch-input"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                checked={values.section_one?.status}
                                                value={values.section_one?.status}
                                            />
                                            <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                        </label>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image (JPEG, JPG, PNG, WEBP) <span className="required_icon">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_one"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_one', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                            {errors.image_one && touched.image_one ? (
                                                <p className="text-danger">{errors.image_one}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Text <span className="required_icon">*</span></Form.Label>
                                            <Form.Control
                                                name="section_one.banner_text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_one?.banner_text}
                                            />
                                            {errors.section_one?.banner_text && touched.section_one?.banner_text ? (
                                                <p className="text-danger">{errors.section_one?.banner_text}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col as={Col} md={6} className="career_editable">
                                        <p className="text-primary fs-6 ">Section 2 -</p>
                                        <Form.Control
                                            type="text"
                                            name="section_two.name"
                                            value={values.section_two?.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            readOnly={readOnlyFields?.section_two_name}
                                        />
                                        {errors.section_two?.name && touched.section_two?.name ? (
                                            <p className="text-danger">{errors.section_two?.name}</p>
                                        ) : null}
                                        <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_two_name')}></i>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="section_two.status"
                                                className="custom-switch-input"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                checked={values.section_two?.status}
                                                value={values.section_two?.status}
                                            />
                                            <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                        </label>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 1 Heading</Form.Label>
                                            <Form.Control
                                                name="section_two.box_one_heading"
                                                value={values.section_two?.box_one_heading}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.section_two?.box_one_heading && touched.section_two?.box_one_heading ? (
                                                <p className="text-danger">{errors.section_two?.box_one_heading}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 1 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_two"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_two', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                            {errors.image_two && touched.image_two ? (
                                                <p className="text-danger">{errors.image_two}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 1 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_two.box_one_text"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_two.box_one_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                            {errors.section_two?.box_one_text && touched.section_two?.box_one_text ? (
                                                <p className="text-danger">{errors.section_two?.box_one_text}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 2 Heading</Form.Label>
                                            <Form.Control
                                                name="section_two.box_two_heading"
                                                value={values.section_two?.box_two_heading}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.section_two?.box_two_heading && touched.section_two?.box_two_heading ? (
                                                <p className="text-danger">{errors.section_two?.box_two_heading}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 2 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_three"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_three', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                            {errors.image_three && touched.image_three ? (
                                                <p className="text-danger">{errors.image_three}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 2 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_two.box_two_text"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_two.box_two_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                            {errors.section_two?.box_two_text && touched.section_two?.box_two_text ? (
                                                <p className="text-danger">{errors.section_two?.box_two_text}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 3 Heading</Form.Label>
                                            <Form.Control
                                                name="section_two.box_three_heading"
                                                value={values.section_two?.box_three_heading}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.section_two?.box_three_heading && touched.section_two?.box_three_heading ? (
                                                <p className="text-danger">{errors.section_two?.box_three_heading}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 3 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_four"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_four', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                            {errors.image_four && touched.image_four ? (
                                                <p className="text-danger">{errors.image_four}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 3 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_two.box_three_text"
                                                // accept=".jpg,.jpeg,.png,.webp"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_two.box_three_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                            {errors.section_two?.box_three_text && touched.section_two?.box_three_text ? (
                                                <p className="text-danger">{errors.section_two?.box_three_text}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col as={Col} md={6} className="career_editable">
                                        <p className="text-primary fs-6 ">Section 3 -</p>
                                        <Form.Control
                                            type="text"
                                            name="section_three.name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.section_three?.name}
                                            readOnly={readOnlyFields?.section_three_name}
                                        />
                                        {errors.section_three?.name && touched.section_three?.name ? (
                                            <p className="text-danger">{errors.section_three?.name}</p>
                                        ) : null}
                                        <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_three_name')}></i>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="section_three.status"
                                                className="custom-switch-input"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                checked={values.section_three?.status}
                                                value={values.section_three?.status}
                                            />
                                            <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                        </label>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_five"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_five', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                            {errors.image_five && touched.image_five ? (
                                                <p className="text-danger">{errors.image_five}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 1 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_six"
                                                accept="jpeg,jpg,png"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_six', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 1 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_three.box_one_text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_three.box_one_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 2 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_seven"
                                                accept="jpeg,jpg,png"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_seven', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 2 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_three.box_two_text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_three.box_two_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 3 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_eight"
                                                accept="jpeg,jpg,png"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_eight', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 3 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_three.box_three_text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_three.box_three_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Box 4 Icon</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_nine"
                                                accept="jpeg,jpg,png"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_nine', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Box 4 Text</Form.Label>
                                            <textarea
                                                type="text"
                                                name="section_three.box_four_text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.section_three.box_four_text}
                                                rows={4}
                                                className="border border-muted w-100 rounded-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                <Row className="mb-4">
                                    <Col as={Col} md={6} className="career_editable">
                                        <p className="text-primary fs-6 ">Section 4 -</p>
                                        <Form.Control
                                            type="text"
                                            name="section_four.name"
                                            value={values.section_four?.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            readOnly={readOnlyFields?.section_four_name}
                                        />
                                        {errors.section_four?.name && touched.section_four?.name ? (
                                            <p className="text-danger">{errors.section_four?.name}</p>
                                        ) : null}
                                        <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_four_name')}></i>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="section_four.status"
                                                className="custom-switch-input"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                checked={values.section_four?.status}
                                                value={values.section_four?.status}
                                            />
                                            <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                        </label>
                                    </Col>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Text</Form.Label>
                                            <textarea type="text" name="section_four.text" onChange={handleChange} onBlur={handleBlur} value={values.section_four.text} rows={4}
                                                className="border border-muted w-100 rounded-3" />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="image_ten"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];

                                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                        setFieldValue('image_ten', file)
                                                    } else {
                                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                        event.target.value = null;
                                                    }
                                                }
                                                }
                                                onBlur={handleBlur}
                                            />
                                            {errors.image_ten && touched.image_ten ? (
                                                <p className="text-danger">{errors.image_ten}</p>
                                            )
                                                : null
                                            }
                                        </Form.Group>
                                    </Col>

                                </Row>

                                <SeoForm
                                    handleChange={handleChange}
                                    values={values}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    readOnlyStatus={false}
                                />
                                <Row className="mt-3 justify-content-center">
                                    {
                                        showAdd && (
                                            <Button type="submit" className="w-auto">
                                                Save
                                            </Button>
                                        )
                                    }
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}