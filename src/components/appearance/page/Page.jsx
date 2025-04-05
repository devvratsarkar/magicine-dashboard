import React from "react";
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
import { PageData } from "../../../commondata/pageData";

export default function Page() {
  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col>
              <PageHeader
                titles="Appearance"
                active="Page List"
                items={["Home"]}
                links={["/dashboard"]}
              />
            </Col>
            <Col className="text-end d-flex justify-content-end gap-4">
              <Link
                to="/appearance/add-new-page"
                className="btn btn-success text-white me-3"
              >
                Add New Page
              </Link>
              <Link
                className="btn btn-danger text-white"
                to={"/soft-delete"}
                state={{ name: "Appearance-Page" }}
              >
                Page Trash
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <PageData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
