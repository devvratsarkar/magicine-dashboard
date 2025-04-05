import React from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, TabContainer, Tabs, Tab, Row, Card, Col, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BlogsData } from "../../../commondata/blogsData";
import { getBlogsTrashPage } from "../../../utils/routes";

export default function Blogs() {
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Blog.includes("add"))
  const showTrash = role === "Admin" || (role === "Staff" && permissions.Blog.includes("view-trash"))
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Blogs" active="Blog List" items={["Home",]} links={["/dashboard"]} />
        </Col>
        <Col className="text-end">
          {
            showAdd && (
              <Link to="/add-blogs" className="btn btn-success text-white me-3" > Add New Blogs </Link>
            )
          }
          {
            showTrash && (
              <Link to={`${getBlogsTrashPage()}`} className="btn btn-danger">Blog Trashed</Link>
            )
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table">
              <BlogsData />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
