import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, Form, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CMSPagesDataTable } from "../../../commondata/cmsPageData";

export default function CMSPages() {
  return (
    <>
      <Row className="justify-content-between align-items-center">
        <Col>
          <PageHeader titles="CMS Page" active="CMS Pages " items={["Home"]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-4">
          <Link to={'#'} className="btn btn-success fit-content">Add New Page</Link>
          <Link
            className="btn btn-danger text-white fit-content"
            to={"/soft-delete"}
            state={{ name: "CMS-Page" }}
          >
            CMS-Page Trashed
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <CMSPagesDataTable />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
