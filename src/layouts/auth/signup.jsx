import React, { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Form, InputGroup, Row, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseapi/firebaseapi";
import { Imagesdata } from "../../commondata/commonimages";
import { useFormik } from "formik";
import { UserResgistrationSchema } from "../../commondata/formvalidations";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const initialValues = {
  full_name: "",
  mobile_number: "",
  email: "",
  password: "",
  confirm_password: "",
  term_conditions: false,
};
function Signup() {
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const RouteChange = () => {
    let path = `${import.meta.env.BASE_URL}auth/authlogin`;
    navigate(path);
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: UserResgistrationSchema,
      onSubmit: async (values) => {
       console.log(values);
      },
    });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword);
  };

  document.querySelector("body").classList.add("login-img");
  return (
    <>
      <div className="page-content">
        <div className="text-dark">
          <Row>
            <Col lg={4} md={6} sm={8} xs={11} className="d-block mx-auto">
              <Card>
                <Card.Body>
                  <div className="text-center mb-6">
                    <Link className="header-brand1" to="#">
                      <img
                        src={Imagesdata("logo")}
                        className="header-brand-img main-logo"
                        alt="Zanex logo"
                      />
                    </Link>
                  </div>
                  <div className="text-center">
                    <h3>Register</h3>
                    <p className="text-muted">Create New Account</p>
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Form.Group>
                        <div className="input-icon">
                          <span className="input-icon-addon">
                            <i className="fa fa-user fs-5"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="User Name"
                            name="full_name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.full_name}
                          />
                        </div>
                        {errors.full_name && touched.full_name ? (
                          <p className={`error`}>{errors.full_name}</p>
                        ) : null}
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group>
                        <div className="input-icon">
                          <span className="input-icon-addon">
                            <i className="fa fa-phone-square fs-5"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                            name="mobile_number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.mobile_number}
                          />
                        </div>
                        {errors.mobile_number && touched.mobile_number ? (
                          <p className={`error`}>{errors.mobile_number}</p>
                        ) : null}
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group>
                        <div className="input-icon">
                          <span className="input-icon-addon">
                            <i className="fa fa-envelope fs-5"></i>
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
                    <Row className="mb-3">
                      <Form.Group>
                        <div className="input-icon">
                          <span
                            className="input-icon-addon pe-auto "
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
                            onClick={toggleConfPasswordVisibility}
                          >
                            {showConfPassword ? (
                              <FiEyeOff size={20} />
                            ) : (
                              <FiEye size={20} />
                            )}
                          </span>
                          <input
                            type={showConfPassword ? "text" : "password"}
                            name="confirm_password"
                            className="form-control"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirm_password}
                          />
                        </div>
                        {errors.confirm_password && touched.confirm_password ? (
                          <p className={`error`}>{errors.confirm_password}</p>
                        ) : null}
                      </Form.Group>
                    </Row>
                    <Form.Group className="form-group">
                      <Row className="ms-4">
                        <Col>
                          <Form.Check
                            type="checkbox"
                            name="term_conditions"
                            id="t&c"
                            checked={values.term_conditions}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Form.Label htmlFor="t&c" className="mt-0">
                            I agree to the
                            <a href="#" className="text-primary">
                              Terms and Policy
                            </a>
                            .
                          </Form.Label>
                          {errors.term_conditions && touched.term_conditions ? (
                            <p className="error">{errors.term_conditions}</p>
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Group>
                    <Row>
                      <Button
                        type="submit"
                        variant="primary"
                        className="btn btn-block px-4"
                      >
                        Sign Up
                      </Button>
                      <div className="text-center pt-3">
                        <p className="text-dark mb-0">
                          Already have an account?
                          <Link
                            to={`${import.meta.env.BASE_URL}auth/authlogin`}
                            className="text-primary ms-1"
                          >
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </Row>
                  </Form>
                  <div className="mt-6 text-center btn-list">
                    <Button
                      variant="facebook"
                      type="button"
                      className="btn-icon "
                    >
                      <i className="fa fa-facebook"></i>
                    </Button>
                    <Button
                      variant="google"
                      type="button"
                      className="btn-icon "
                    >
                      <i className="fa fa-google"></i>
                    </Button>
                    <Button
                      variant="twitter"
                      type="button"
                      className="btn-icon"
                    >
                      <i className="fa fa-twitter"></i>
                    </Button>
                    <Button
                      variant="dribbble"
                      type="button"
                      className="btn-icon "
                    >
                      <i className="fa fa-dribbble"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Signup;
