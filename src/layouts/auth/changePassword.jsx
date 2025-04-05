import React, { useState, Fragment, useEffect } from "react";
import { Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Imagesdata } from "../../commondata/commonimages";
import { useFormik } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { passwordResetSchema, UserLoginSchema } from "../../commondata/formvalidations";
import Loader from "../../layouts/layoutcomponents/loader";
import { publicRequest } from "../../utils/baseApi";
import toast from "react-hot-toast";

function ChangePassword() {
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const token = queryParams.get("token");


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const [loader, setLoader] = useState(false);
    const navigate = useNavigate()

    document.querySelector("body").classList.add("login-img");



    const initialValues = {
        password: "",
        password_confirmation: "",
    };


    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setValues } =
        useFormik({
            initialValues: initialValues,
            validationSchema: passwordResetSchema,
            onSubmit: async (values) => {
                try {
                    setLoader(true)
                    const res = await publicRequest.post(`/reset-password/${userId}/${token}`, values);
                    if (res.data.http_status_code === 200) {
                        setLoader(false)
                        toast.success(res.data.message)
                        navigate("/")
                    }
                } catch (error) {
                    setLoader(false)
                    toast.error(error.response.data.message)
                }
            }
        });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmShowPassword(!showConfirmPassword);
    };

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
                                alt=""
                            />
                        </div>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <span className="login100-form-title">Reset Password</span>

                                <Row className="mb-3">
                                    <Form.Group>
                                        <div className="input-icon">
                                            <span
                                                className="input-icon-addon pe-auto"
                                                style={{ cursor: "pointer" }}
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <FiEyeOff size={20} />
                                                ) : (
                                                    <FiEye size={20} />
                                                )}
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control"
                                                placeholder="Password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                            />
                                        </div>
                                        {errors.password && touched.password ? (
                                            <p className={`error`}>{errors.password}</p>
                                        ) : null}
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group>
                                        <div className="input-icon">
                                            <span
                                                className="input-icon-addon pe-auto"
                                                style={{ cursor: "pointer" }}
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? (
                                                    <FiEyeOff size={20} />
                                                ) : (
                                                    <FiEye size={20} />
                                                )}
                                            </span>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="password_confirmation"
                                                className="form-control"
                                                placeholder="Confirm Password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password_confirmation}
                                            />
                                        </div>
                                        {errors.password_confirmation && touched.password_confirmation ? (
                                            <p className={`error`}>{errors.password_confirmation}</p>
                                        ) : null}
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3 text-end m-0">
                                </Row>

                                <Row className="mb-3 m-0">
                                    <Button
                                        type="submit"
                                        className="btn btn-primary"
                                        variant="primary"
                                    >
                                        Change Password
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

export default ChangePassword;
