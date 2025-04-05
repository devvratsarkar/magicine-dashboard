import React, { useEffect, useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, Form, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { contactUsValidation } from "../../../commondata/formvalidations";
import "suneditor/dist/css/suneditor.min.css";
import SeoForm from "../../seo-page/SeoForm"
import { useAddContactUsMutation, useGetContactUsQuery } from "../../../redux/features/cmsEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";

export default function ContactUs() {

    const [selectedThubnail, setSelectedThubnail] = useState(null);
    const [viewThubnail, setViewThubnail] = useState(true);
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetContactUsQuery()
    const [addContactUs, { isLoading: loading }] = useAddContactUsMutation()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))
    console.log("permissions", permissions)

    const showAdd = role === "Admin" || (role === "Staff" && permissions.ContactUs.includes("add"))

    const initialValues = {
        banner_image: "",
        email_details: "",
        phone_number_one: "",
        phone_number_two: "",
        content: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
        id: "",
        banner_status: true,
        banner_name: "",
        banner_link: "",
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: contactUsValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            try {
                const response = await addContactUs(formData);
                if (response?.data?.http_status_code == 201 || response?.data?.http_status_code == 200) {
                    refetch()
                    toast.success(response.data.message)

                }
            } catch (error) {
                console.error(error);
            }
        },
    });


    useEffect(() => {
        setFieldValue("email_details", singleContactUs?.email_details)
        setFieldValue("phone_number_one", singleContactUs?.phone_number_one)
        setFieldValue("phone_number_two", singleContactUs?.phone_number_two)
        setFieldValue("content", singleContactUs?.content)
        setFieldValue("meta_title", singleContactUs?.meta_title)
        setFieldValue("meta_description", singleContactUs?.meta_description)
        setFieldValue("meta_keywords", singleContactUs?.meta_keywords)
        setFieldValue("og_tag", singleContactUs?.og_tag)
        setFieldValue("schema_markup", singleContactUs?.schema_markup)
        setFieldValue("id", singleContactUs?.id)
        setFieldValue("name", singleContactUs?.name)
        setFieldValue("link", singleContactUs?.link)
        setFieldValue("status", singleContactUs?.status)
        setFieldValue("banner_name", singleContactUs?.banner_name)
        setFieldValue("banner_link", singleContactUs?.banner_link)
        setFieldValue("banner_status", singleContactUs?.banner_status)
    }, [isSuccess])

    const singleContactUs = data?.data[0]

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];

        if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
            setFieldValue('banner_image', file)
            setViewThubnail(false)
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedThubnail(reader.result);
            };
            reader.readAsDataURL(file);

        } else {
            toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
            event.target.value = null;
        }
    }
    useEffect(() => {
        setFieldValue("banner_image", singleContactUs?.banner_image)
    }, [isSuccess])

    const generateOgTag = () => {
        let mainImage;
        const completeImage = values.banner_image.startsWith("http")
        if (!singleContactUs?.banner_image) {
            mainImage = `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`
        } else {
            if (!completeImage) {
                mainImage = `${MEDIA_BASE_URL}/${values.banner_image}`
            } else {
                mainImage = `${values.banner_image}`
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
            {isLoading && <Loader /> || loading && <Loader />}
            <Row className="justify-content-between">
                <Col>
                    <PageHeader titles="CMS- Contact Us" active="Contact Us" items={["Home", "CMS",]} links={["/dashboard"]} />
                </Col>

            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-2">
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Row>
                                                <Col as={Col} md={10}>
                                                    <Form.Label>Banner Image (JPEG, JPG, PNG, WEBP)</Form.Label>
                                                </Col>
                                                <Col as={Col} md={2} className="text-end mt-3">
                                                    <label className="custom-switch">
                                                        <input
                                                            type="checkbox"
                                                            name="banner_status"
                                                            className="custom-switch-input"
                                                            onChange={(e) => setFieldValue("banner_status", e.target.checked)}
                                                            onBlur={handleBlur}
                                                            checked={values.banner_status}
                                                        />
                                                        <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                                                    </label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col as={Col} md={3} className="d-flex justify-content-center" >
                                                    {viewThubnail ? <div className="position-relative">
                                                        <Link to={"/view-images"} state={{ data: singleContactUs?.banner_image }}><img src={singleContactUs?.banner_image} alt="error" width={50} height={50} /></Link>
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
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Name</Form.Label>
                                            <Form.Control
                                                name="banner_name"
                                                value={values?.banner_name}
                                                onChange={handleChange}
                                                onBlur={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Link</Form.Label>
                                            <Form.Control
                                                name="banner_link"
                                                value={values?.banner_link}
                                                onChange={handleChange}
                                                onBlur={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Email Details <span className="required_icon">*</span></Form.Label>
                                            <Form.Control
                                                type="email_details"
                                                name="email_details"
                                                value={values.email_details}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.email_details && touched.email_details ? (
                                                <p className="text-danger">{errors.email_details}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                Phone Number 1 <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone_number_one"
                                                value={values.phone_number_one}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.phone_number_one && touched.phone_number_one ? (
                                                <p className="text-danger">{errors.phone_number_one}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                Phone Number 2
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone_number_two"
                                                value={values.phone_number_two}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {errors.phone_number_two && touched.phone_number_two ? (
                                                <p className="text-danger">{errors.phone_number_two}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>
                                                Address <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name='content'
                                                value={values.content}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                rows={4}
                                            />
                                            {errors.content && touched.content ? (
                                                <p className="text-danger">{errors.content}</p>
                                            ) : null}
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
                                                Submit
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