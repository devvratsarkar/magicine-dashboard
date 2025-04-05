import React, { useEffect, useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, Form, } from "react-bootstrap";
import { useFormik } from "formik";
import { AboutUsValidation } from "../../../commondata/formvalidations";
import "suneditor/dist/css/suneditor.min.css";
import SeoForm from "../../seo-page/SeoForm"
import toast from "react-hot-toast";
import { useAddAboutUsMutation, useGetAboutUsQuery } from "../../../redux/features/cmsEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";

export default function AboutUs() {
    const { data, isSuccess, isLoading, refetch } = useGetAboutUsQuery();
    const [addAboutUs, { isLoading: loading }] = useAddAboutUsMutation();
    const [readOnlyFields, setReadOnlyFields] = useState({
        section_two_name: true,
        section_three_name: true,
        section_four_name: true,
        section_five_name: true,
        section_six_name: true,
        section_seven_name: true,
    });

    const handleEditClick = (field) => {
        setReadOnlyFields((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    const showAdd = role === "Admin" || (role === "Staff" && permissions.AboutUs.includes("add"))



    const initialValues = {
        section_one: { status: true },
        section_two: {
            name: "About Magicine Pharma",
            status: true,
            heading: "",
            text: "",
            box_heading_one: "",
            box_heading_two: "",
            box_heading_three: "",
            box_heading_four: "",
        },
        section_three: { name: "What We are?", status: true, text: "" },
        section_four: { name: "Our Achievements?", status: true },
        section_five: { name: "Our Vision", status: true, text: "" },
        section_six: {
            name: "Meet Our Founder",
            status: true,
            founder_name: '',
            text: '',
        },
        section_seven: { name: "Certifications", status: true },
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
        image_eleven: "",
        image_twelve: "",
        image_thirteen: "",
        image_fourteen: "",
        image_fifteen: "",
        image_sixteen: "",
        image_seventeen: "",
        image_eighteen: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
        id: ""
    };

    const { values, handleChange, handleSubmit, handleBlur, setFieldValue, errors, touched, resetForm, validateForm } = useFormik({
        initialValues,
        validationSchema: AboutUsValidation,
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
                const response = await addAboutUs(formData);
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


    const isRequired = (fieldName, fieldValue) => {
        const imageFields = {
            image_one: 'section_one.banner_image',
            image_two: 'section_two.image',
            image_three: 'section_two.box_image_one',
            image_four: 'section_two.box_image_two',
            image_five: 'section_two.box_image_three',
            image_six: 'section_two.box_image_four',
            image_seven: 'section_four.image_one',
            image_eight: 'section_four.image_two',
            image_nine: 'section_four.image_three',
            image_ten: 'section_four.image_four',
            image_eleven: 'section_four.image_five',
            image_twelve: 'section_four.image_six',
            image_thirteen: 'section_four.image_seven',
            image_fourteen: 'section_four.image_eight',
            image_fifteen: 'section_six.image',
            image_sixteen: 'section_seven.image_one',
            image_seventeen: 'section_seven.image_two',
            image_eighteen: 'section_seven.image_three'
        };

        if (imageFields.hasOwnProperty(fieldName)) {

            const backendKey = imageFields[fieldName];
            return !!(fieldValue && fieldValue === getAboutUsValue(backendKey));
        }

        return false;
    };

    const getAboutUsValue = (key) => {
        const keys = key.split('.');
        let value = data.data[0];
        for (const k of keys) {
            if (value && value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                return null;
            }
        }
        return value;
    };
    const AboutUsData = data?.data[0]
    useEffect(() => {
        if (isSuccess && data?.data?.length > 0) {
            Object.keys(initialValues).forEach((key) => {
                if (data.data[0][key] !== undefined && !isRequired(key, data.data[0][key])) {
                    setFieldValue(key, data.data[0][key]);
                }
            });
        }

        setFieldValue("section_six.text", AboutUsData?.section_six?.text || "");
        setFieldValue("image_one", AboutUsData?.section_one?.banner_image)
        setFieldValue("image_two", AboutUsData?.section_two?.image)
        setFieldValue("image_three", AboutUsData?.section_two?.box_image_one)
        setFieldValue("image_four", AboutUsData?.section_two?.box_image_two)
        setFieldValue("image_five", AboutUsData?.section_two?.box_image_three)
        setFieldValue("image_six", AboutUsData?.section_two?.box_image_four)
        setFieldValue("image_seven", AboutUsData?.section_four?.image_one)
        setFieldValue("image_eight", AboutUsData?.section_four?.image_two)
        setFieldValue("image_nine", AboutUsData?.section_four?.image_three)
        setFieldValue("image_ten", AboutUsData?.section_four?.image_four)
        setFieldValue("image_eleven", AboutUsData?.section_four?.image_five)
        setFieldValue("image_twelve", AboutUsData?.section_four?.image_six)
        setFieldValue("image_thirteen", AboutUsData?.section_four?.image_seven)
        setFieldValue("image_fourteen", AboutUsData?.section_four?.image_eight)
        setFieldValue("image_fifteen", AboutUsData?.section_six?.image)
        setFieldValue("image_sixteen", AboutUsData?.section_seven?.image_one)
        setFieldValue("image_seventeen", AboutUsData?.section_seven?.image_two)
        setFieldValue("image_eighteen", AboutUsData?.section_seven?.image_three)
        setFieldValue("id", AboutUsData?.id)
    }, [isSuccess, data, setFieldValue]);


    const generateOgTag = () => {

        let mainImage;

        const completeImage = values.image_one.startsWith("http")

        if (!AboutUsData?.section_one?.banner_image) {
            mainImage = `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`
        } else {
            if (!completeImage) {
                mainImage = `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`
            } else {
                mainImage = `${values.image_one}`
            }
        }



        const ogTag = `<meta property="og:type" content="website"><meta property="og:title" content='${values.meta_title || "undefined"}'><meta property="og:description" content="${values.meta_description || "undefined"}"><meta property="og:url" content="${USER_BASE_URL}/about-us"><meta property="og:site_name" content="Magicine Pharma"><meta property="og:image" content="${mainImage}">`

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
                    <PageHeader names="CMS- About Us" active="About Us" items={["Home", "CMS",]} links={["/dashboard"]} />
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
                                    <Row>
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
                                                    checked={values.section_one.status}
                                                    value={values.section_one.status}
                                                />
                                                <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                            </label>
                                        </Col>
                                        <Col as={Col} md={6}>
                                            <Form.Group>
                                                <Form.Label>
                                                    Banner Image <span className="text-danger">*</span>
                                                </Form.Label>
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
                                                {
                                                    errors.image_one && touched.image_one ?
                                                        <p className="text-danger">{errors.image_one}</p> : null
                                                }

                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-6">
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
                                                <p className="error">{errors.section_two?.name}</p>
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

                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Heading <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="section_two.heading"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.section_two?.heading}
                                                    />
                                                    {
                                                        errors.section_two?.heading && touched.section_two?.heading ?
                                                            <p className="text-danger">{errors.section_two?.heading}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>Image <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="JPEG, JPG, PNG"
                                                        name="image_two"
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
                                                    {
                                                        errors.image_two && touched.image_two ?
                                                            <p className="text-danger">{errors.image_two}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={12}>
                                                <Form.Label>Text <span className="text-danger">*</span></Form.Label>
                                                <SunEditor
                                                    type="text"
                                                    name="section_two.text"
                                                    onChange={(content) => setFieldValue("section_two.text", content)}
                                                    onBlur={handleBlur}
                                                    // value={values?.section_two?.text}
                                                    setContents={values?.section_two?.text || ""}
                                                />
                                                {
                                                    errors.section_two?.text && touched.section_two?.text ?
                                                        <p className="text-danger">{errors.section_two?.text}</p> : null
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 1 Heading <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="section_two.box_heading_one"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.section_two?.box_heading_one}
                                                    />
                                                    {
                                                        errors.section_two?.box_heading_one && touched.section_two?.box_heading_one ?
                                                            <p className="text-danger">{errors.section_two?.box_heading_one}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 1 Image <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_three"
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
                                                    {
                                                        errors.image_three && touched.image_three ?
                                                            <p className="text-danger">{errors.image_three}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 2 Heading <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="section_two.box_heading_two"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.section_two?.box_heading_two}
                                                    />
                                                    {
                                                        errors.section_two?.box_heading_two && touched.section_two?.box_heading_two ?
                                                            <p className="text-danger">{errors.section_two?.box_heading_two}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 2 Image <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_four"
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
                                                    {
                                                        errors.image_four && touched.image_four ?
                                                            <p className="text-danger">{errors.image_four}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 3 Heading <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="section_two.box_heading_three"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.section_two?.box_heading_three}
                                                    />
                                                    {
                                                        errors.section_two?.box_heading_three && touched.section_two?.box_heading_three ?
                                                            <p className="text-danger">{errors.section_two?.box_heading_three}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 3 Image <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_five"
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
                                                    {
                                                        errors.image_five && touched.image_five ?
                                                            <p className="text-danger">{errors.image_five}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 4 Heading <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="section_two.box_heading_four"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.section_two?.box_heading_four}
                                                    />
                                                    {
                                                        errors.section_two?.box_heading_four && touched.section_two?.box_heading_four ?
                                                            <p className="text-danger">{errors.section_two?.box_heading_four}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Box 4 Image <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_six"
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
                                                    {
                                                        errors.image_six && touched.image_six ?
                                                            <p className="text-danger">{errors.image_six}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Row>

                                    <Row className="mt-6">
                                        <Col as={Col} md={6} className="career_editable">
                                            <p className="text-primary fs-6 ">Section 3 -</p>
                                            <Form.Control
                                                type="text"
                                                name="section_three.name"
                                                value={values.section_three?.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
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
                                        <Row>
                                            <Col as={Col} md={12}>
                                                <Form.Label>Text <span className="text-danger">*</span></Form.Label>
                                                <SunEditor
                                                    setOptions={options_for_sunEditor}
                                                    type="text"
                                                    name="section_three.text"
                                                    onChange={(content) => setFieldValue("section_three.text", content)}
                                                    onBlur={handleBlur}
                                                    // value={values.section_three?.text}
                                                    setContents={values.section_three?.text || ""}
                                                    className="form-control"
                                                    rows={5}
                                                />
                                                {
                                                    errors.section_three?.text && touched.section_three?.text ?
                                                        <p className="text-danger">{errors.section_three?.text}</p> : null
                                                }
                                            </Col>
                                        </Row>
                                    </Row>

                                    <Row className="mt-6">
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
                                                <p className="error">{errors.section_four?.name}</p>
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
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 1 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_seven"
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
                                                    {
                                                        errors.image_seven && touched.image_seven ?
                                                            <p className="text-danger">{errors.image_seven}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 2 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_eight"
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
                                                    {
                                                        errors.image_eight && touched.image_eight ?
                                                            <p className="text-danger">{errors.image_eight}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 3 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_nine"
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
                                                    {
                                                        errors.image_nine && touched.image_nine ?
                                                            <p className="text-danger">{errors.image_nine}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 4 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_ten"
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
                                                    {
                                                        errors.image_ten && touched.image_ten ?
                                                            <p className="text-danger">{errors.image_ten}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 5 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_eleven"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_eleven', file)
                                                            } else {
                                                                toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                                event.target.value = null;
                                                            }
                                                        }
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.image_eleven && touched.image_eleven ?
                                                            <p className="text-danger">{errors.image_eleven}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 6 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_twelve"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_twelve', file)
                                                            } else {
                                                                toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                                event.target.value = null;
                                                            }
                                                        }
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.image_twelve && touched.image_twelve ?
                                                            <p className="text-danger">{errors.image_twelve}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 7 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_thirteen"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_thirteen', file)
                                                            } else {
                                                                toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                                event.target.value = null;
                                                            }
                                                        }
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.image_thirteen && touched.image_thirteen ?
                                                            <p className="text-danger">{errors.image_thirteen}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 8 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_fourteen"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_fourteen', file)
                                                            } else {
                                                                toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                                event.target.value = null;
                                                            }
                                                        }
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.image_fourteen && touched.image_fourteen ?
                                                            <p className="text-danger">{errors.image_fourteen}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col as={Col} md={6} className="career_editable">
                                            <p className="text-primary fs-6 ">Section 5 -</p>
                                            <Form.Control
                                                type="text"
                                                name="section_five.name"
                                                value={values.section_five?.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly={readOnlyFields?.section_five_name}
                                            />
                                            {errors.section_five?.name && touched.section_five?.name ? (
                                                <p className="error">{errors.section_five?.name}</p>
                                            ) : null}
                                            <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_five_name')}></i>
                                        </Col>
                                        <Col as={Col} md={6}>
                                            <label className="custom-switch">
                                                <input
                                                    type="checkbox"
                                                    name="section_five.status"
                                                    className="custom-switch-input"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={values.section_five?.status}
                                                    value={values.section_five?.status}
                                                />
                                                <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                            </label>
                                        </Col>
                                        <Row>
                                            <Col as={Col} md={12}>
                                                <Form.Group>
                                                    <Form.Label>Text <span className="text-danger">*</span></Form.Label>
                                                    <SunEditor
                                                        setOptions={options_for_sunEditor}
                                                        type="text"
                                                        name="section_five.text"
                                                        onChange={(content) => setFieldValue("section_five.text", content)}
                                                        onBlur={handleBlur}
                                                        // value={values.section_five?.text}
                                                        setContents={values.section_five?.text || ""}
                                                        className="form-control"
                                                        rows={5}
                                                    />
                                                    {
                                                        errors.section_five?.text && touched.section_five?.text ?
                                                            <p className="text-danger">{errors.section_five?.text}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Row className="mt-6">
                                        <Col as={Col} md={6} className="career_editable">
                                            <p className="text-primary fs-6 ">Section 6 -</p>
                                            <Form.Control
                                                type="text"
                                                name="section_six.name"
                                                value={values.section_six?.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly={readOnlyFields?.section_six_name}
                                            />
                                            {errors.section_six?.name && touched.section_six?.name ? (
                                                <p className="error">{errors.section_six?.name}</p>
                                            ) : null}
                                            <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_six_name')}></i>
                                        </Col>
                                        <Col as={Col} md={6}>
                                            <label className="custom-switch">
                                                <input
                                                    type="checkbox"
                                                    name="section_six.status"
                                                    className="custom-switch-input"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={values.section_six?.status}
                                                    value={values.section_six?.status}
                                                />
                                                <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                            </label>
                                        </Col>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_fifteen"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_fifteen', file)
                                                            } else {
                                                                toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                                event.target.value = null;
                                                            }
                                                        }
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.image_fifteen && touched.image_fifteen ?
                                                            <p className="text-danger">{errors.image_fifteen}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Founder's Name <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="section_six.founder_name"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.section_six?.founder_name}
                                                    />
                                                    {
                                                        errors.section_six?.founder_name && touched.section_six?.founder_name ?
                                                            <p className="text-danger">{errors.section_six?.founder_name}</p> : null
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={12}>
                                                <Form.Group>
                                                    <Form.Label>
                                                        Text <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <SunEditor
                                                        setOptions={options_for_sunEditor}
                                                        name="section_six.text"
                                                        onChange={(content) => setFieldValue("section_six.text", content)}
                                                        onBlur={handleBlur}
                                                        setContents={values?.section_six?.text || ""}
                                                        className="form-control"
                                                    />
                                                    {errors.section_six?.text && touched.section_six?.text && (
                                                        <p className="text-danger">{errors.section_six?.text}</p>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                        </Row>
                                    </Row>
                                    <Row className="mt-6">
                                        <Col as={Col} md={6} className="career_editable">
                                            <p className="text-primary fs-6 ">Section 7 -</p>
                                            <Form.Control
                                                type="text"
                                                name="section_seven.name"
                                                value={values.section_seven?.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly={readOnlyFields?.section_seven_name}
                                            />
                                            {errors.section_seven?.name && touched.section_seven?.name ? (
                                                <p className="error">{errors.section_seven?.name}</p>
                                            ) : null}
                                            <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_seven_name')}></i>
                                        </Col>
                                        <Col as={Col} md={6}>
                                            <label className="custom-switch">
                                                <input
                                                    type="checkbox"
                                                    name="section_seven.status"
                                                    className="custom-switch-input"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={values.section_seven?.status}
                                                    value={values.section_seven?.status}
                                                />
                                                <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                            </label>
                                        </Col>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 1 <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_sixteen"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_sixteen', file)
                                                            } else {
                                                                toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                                                event.target.value = null;
                                                            }
                                                        }
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {
                                                        errors.image_sixteen && touched.image_sixteen ?
                                                            <p className="text-danger">{errors.image_sixteen}</p> : null

                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 2 </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_seventeen"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_seventeen', file)
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
                                        </Row>
                                        <Row>
                                            <Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Image 3</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        name="image_eighteen"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];

                                                            if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                                                setFieldValue('image_eighteen', file)
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

                                        </Row>
                                    </Row>
                                    <SeoForm
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        readOnlyStatus={false}
                                    />
                                </Row>
                                <Row className="justify-content-center my-6">
                                    {
                                        showAdd && (
                                            <Button type="submit" className="w-auto">Update</Button>
                                        )
                                    }
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
}