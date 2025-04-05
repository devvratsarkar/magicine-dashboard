import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Row, Col, InputGroup, Card, Image } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import bannerImage from "../../../assets/images/dashboard/bannerimage.png";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ViewImage() {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log("location", location);
  const imageUrl = location?.state?.data
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Category-Image"
                active="View Image"
                items={["Home"]}
              />
            </Col>
            <Col className="text-end">
              <Link
                to="/catalogue/add-new-category"
                className="btn btn-primary text-white me-3"
              >
                Add category
              </Link>
              <Link
                to="/catalogue/category"
                className="btn btn-success text-white me-3"
              >
                View All category
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Card>
          <Card.Body>
            <Row>
              <img src={imageUrl} alt="error" width={400} height={200} style={{ objectFit: 'contain' }} />
            </Row>

            <Row>
              <Col className="text-center mt-5">
                <Link to={navigate(-1)} className="btn btn-primary">
                  Close
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}
