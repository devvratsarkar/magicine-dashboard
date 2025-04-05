import React, { useState } from "react";
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
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { CategoryDataTable } from "../../../commondata/categorydata";
import { SpecificationData } from "../../../commondata/specificatiionData";
import AddSpecification from "./AddSpecification";

export default function specifications() {
  const [addSpecification, setAddSpecification] = useState(false);

  const handleAddSpecificationOpen = () => {
    setAddSpecification(true);
  };

  const handleAddSpecificationClose = () => {
    setAddSpecification(false);
  };

  return (
    <>
      <AddSpecification
        show={addSpecification}
        hide={handleAddSpecificationClose}
      />
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Settings"
                active="Specification List"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end d-flex justify-content-end gap-4">
              <button
                onClick={handleAddSpecificationOpen}
                className="btn btn-success text-white me-3"
              >
                Add Specifications
              </button>
              <Link
                className="btn btn-danger text-white"
                to={"/soft-delete"}
                state={{ name: "Specifications" }}
              >
                Specifications Trash
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <SpecificationData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
