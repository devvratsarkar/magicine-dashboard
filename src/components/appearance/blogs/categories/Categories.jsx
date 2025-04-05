import React from 'react'
import { Row, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from '../../../../layouts/layoutcomponents/pageheader';
import { BlogsCategoriesData } from '../../../../commondata/blogsCategoriesData';
import { getAddNewBlogCategoriesPage, getBlogCategoriesTrashPage } from '../../../../utils/routes';
export default function Categories() {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.BlogCategory.includes("add"))
    const showTrash = role === "Admin" || (role === "Staff" && permissions.BlogCategory.includes("view-trash"))
    return (
        <>
            <Row className="align-items-center">
                <Col><PageHeader titles="Blogs- Categories" active="categories" items={["Home",]} links={["/dashboard"]} /></Col>
                <Col className="text-end">
                    {
                        showAdd && (
                            <Link to={`${getAddNewBlogCategoriesPage()}`} className="btn btn-success text-white me-3" >Add New Category</Link>
                        )
                    }
                    {
                        showTrash && (
                            <Link to={`${getBlogCategoriesTrashPage()}`} className="btn btn-danger">Categories Trashed</Link>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="data_table">
                            <BlogsCategoriesData />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
