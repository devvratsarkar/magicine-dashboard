import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Imagesdata } from "../../commondata/commonimages";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation

import Loader from "../layoutcomponents/loader";
import { publicRequest } from "../../utils/baseApi";
import toast from "react-hot-toast";

function ResetEmail() {
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();
    document.querySelector("body").classList.add("login-img");

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
    });

    const initialValues = {
        email: "",
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
        useFormik({
            initialValues: initialValues,
            validationSchema: validationSchema,
            onSubmit: async (values) => {
                try {
                    setLoader(true);
                    const res = await publicRequest.post("/send-reset-email", values);
                    if (res.data.http_status_code === 200) {
                        setLoader(false);
                        toast.success(res.data.message);
                        navigate("/");
                    }
                } catch (error) {
                    console.log(error);
                    setLoader(false);
                    console.log(Date());
                    toast.error(error.response.data.message);
                }
            },
        });

    return (
        <>
            {loader && <Loader />}
            <Row>
                <Col lg={4} md={6} sm={8} xs={11} className="d-block mx-auto">
                    <Card>
                        <div className="text-center mt-3">
                            <img
                                src={Imagesdata("logo")}
                                className="header-brand-img"
                                alt="logo"
                            />
                        </div>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <span className="login100-form-title">Reset Password</span>
                                <Row className="mb-3">
                                    <Form.Group>
                                        <div className="input-icon">
                                            <span className="input-icon-addon">
                                                <i
                                                    className="fe fe-mail fs-5"
                                                    style={{ fontWeight: 500 }}
                                                ></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Email"
                                                name="email"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.email}
                                            />
                                        </div>
                                        {errors.email && touched.email ? (
                                            <p className={`error`}>{errors.email}</p>
                                        ) : null}
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3 m-0">
                                    <Button
                                        type="submit"
                                        className="btn btn-primary"
                                        variant="primary"
                                    >
                                        Submit
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

export default ResetEmail;
