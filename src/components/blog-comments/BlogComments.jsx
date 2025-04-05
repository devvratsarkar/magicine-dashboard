import React from "react";
import { Row, Card, Col, } from "react-bootstrap";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { BlogCommentDataTable } from "../../commondata/blogCommentData";

export default function BlogComments() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.Blog.includes("add"))
    const showTrash = role === "Admin" || (role === "Staff" && permissions.Blog.includes("view-trash"))
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Blog Comments" active="All Blog Comments" items={["Home",]} links={["/dashboard"]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <BlogCommentDataTable />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
