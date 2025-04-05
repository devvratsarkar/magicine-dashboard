import React from "react";
import { Link } from "react-router-dom";
import {Row,Col, Card, Form} from "react-bootstrap"
import { Imagesdata } from "../../../commondata/commonimages";
export default function ForgotPassword() {
  return (
        <div className="">
          <div
            className="col-login mx-auto mt-7"
           
          >
            <div className="text-center">
              <img
                src={Imagesdata("logo")}
                className="header-brand-img"
                alt=""
              />
            </div>
          </div>
          <div className="container-login100">
            <Row>
              <Col className=" col-login mx-auto">
                <Form className="card shadow-none" method="post">
                  <Card.Body>
                    <div className="text-center">
                      <span className="login100-form-title">
                        Forgot Password
                      </span>
                      <p className="text-muted">
                        Enter the email address registered on your account
                      </p>
                    </div>
                    <div className="pt-3" id="forgot">
                      <div className="form-group">
                        <label className="form-label">E-Mail</label>
                        <input
                          className="form-control"
                          placeholder="Enter Your Email"
                          type="email"
                        />
                      </div>
                      <div className="submit">
                        <Link
                          to={`${import.meta.env.BASE_URL}dashboard/`}
                          className="btn btn-primary d-grid"
                        >
                          Submit
                        </Link>
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-dark mb-0">
                          Forgot It?
                          <Link className="text-primary ms-1" to="#">
                            Send me Back
                          </Link>
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-flex justify-content-center my-3">
                      <Link to="#" className="social-login  text-center me-4">
                        <i className="fa fa-google"></i>
                      </Link>
                      <Link to="#" className="social-login  text-center me-4">
                        <i className="fa fa-facebook"></i>
                      </Link>
                      <Link to="#" className="social-login  text-center">
                        <i className="fa fa-twitter"></i>
                      </Link>
                    </div>
                  </Card.Footer>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
  );
}
