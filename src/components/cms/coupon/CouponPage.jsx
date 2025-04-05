import React, { useEffect, useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import {
    Nav,
    TabContainer,
    Tabs,
    Tab,
    Row,
    Card,
    Col,
    Button,
    Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { CMSCouponContentPage, CMSCustomerSupportPolicyValidation } from "../../../commondata/formvalidations";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import Suneditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import SeoForm from "../../seo-page/SeoForm"
import { useAddUpdateCouponPageContentMutation, useGetCouponPageContentQuery } from "../../../redux/features/cmsEndPoints"
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";

export default function CouponPage() {
    const [selectedThubnail, setSelectedThubnail] = useState(null);
    const [viewThubnail, setViewThubnail] = useState(true);
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetCouponPageContentQuery()
    const [addcustomerSupport, { isLoading: loading }] = useAddUpdateCouponPageContentMutation()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permmissions"))

    const showButton = role === "Admin" || role === "Staff" && permissions.CouponPageContent.includes("add")

    const initialValues = {
        banner_image: "",
        content: "",
        id: "",
        meta_description: "",
        meta_keywords: "",
        meta_title: "",
        page_title: "",
        suneditor_content: "",
        banner_name: "",
        banner_link: "",
        banner_status: true
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
        validateForm
    } = useFormik({
        initialValues: initialValues,
        validationSchema: CMSCouponContentPage,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            try {
                const response = await addcustomerSupport(formData);
                if (response?.data?.http_status_code === 201 || response?.data?.http_status_code === 200) {
                    refetch()
                    toast.success(response.data.message)
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


    const singleCustomerSupportPolicy = data?.data

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
    }

    useEffect(() => {
        setFieldValue("content", singleCustomerSupportPolicy?.content)
        setFieldValue("id", singleCustomerSupportPolicy?.id)
        setFieldValue("banner_image", singleCustomerSupportPolicy?.banner_image)
        setFieldValue("meta_title", singleCustomerSupportPolicy?.meta_title)
        setFieldValue("meta_description", singleCustomerSupportPolicy?.meta_description)
        setFieldValue("meta_keywords", singleCustomerSupportPolicy?.meta_keywords)
        setFieldValue("og_tag", singleCustomerSupportPolicy?.og_tag)
        setFieldValue("schema_markup", singleCustomerSupportPolicy?.schema_markup)
        setFieldValue("banner_status", singleCustomerSupportPolicy?.banner_status)
        setFieldValue("banner_name", singleCustomerSupportPolicy?.banner_name)
        setFieldValue("banner_link", singleCustomerSupportPolicy?.banner_link)
    }, [isSuccess])


    return (
        <>{isLoading && <Loader /> || loading && <Loader />}
            <Row className="justify-content-between">
                <Col>
                    <PageHeader
                        titles="CMS Page"
                        active="Coupon Content Page"
                        items={["Home"]}
                        links={["/dashboard"]}
                    />
                </Col>

                <Col className="my-5 text-end">
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
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>
                                                Content <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Suneditor
                                                name="content"
                                                setOptions={options_for_sunEditor}
                                                onChange={(content) =>
                                                    setFieldValue("content", content)
                                                }

                                                onBlur={() => setFieldTouched("content", true)}
                                                setContents={values.content}
                                            />
                                            {errors.content && touched.content ? (
                                                <p className="error">{errors.content}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Row>
                                                <Col as={Col} md={6}>
                                                    <Form.Label>Banner Image (JPEG, JPG, PNG, WEBP)</Form.Label>
                                                </Col>
                                                <Col as={Col} md={6} className="text-align-end mt-3">
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
                                                        <Link to={"/view-images"} state={{ data: singleCustomerSupportPolicy?.banner_image }}><img src={singleCustomerSupportPolicy?.banner_image} alt="error" width={50} height={50} /></Link>
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
                                                onBlur={handleBlur}
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
                                                onBlur={handleBlur}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <SeoForm
                                        handleChange={handleChange}
                                        values={values}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        readOnlyStatus={false}
                                    />
                                </Row>
                                <Row></Row>
                                <Row className="mt-3 justify-content-center">
                                    {
                                        showButton && (
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
            </Row >
        </>
    );
}