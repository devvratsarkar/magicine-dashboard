import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../../redux/slices/allModalSlice";
import Loader from "../../../../layouts/layoutcomponents/loader";
import Error from "../../../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { generateEditBlogCategoriesPage, generateViewBlogCategoriesPage } from "../../../../utils/routes";
import { useGetDeletedBlogsCategoryQuery } from "../../../../redux/features/blogsEndPoints";
import PageHeader from "../../../../layouts/layoutcomponents/pageheader";

export const CategoryDeleted = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetDeletedBlogsCategoryQuery()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = role === "Admin" || (role === "Staff" && permissions.BlogCategory.includes("restore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.BlogCategory.includes("delete"))

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row) => row?.id,
                sortable: true,
            },
            {
                name: "Name",
                sortable: true,
                cell: (row) => (<div>{row?.name}</div>)
            },
            {
                name: "Image",
                sortable: true,
                cell: (row) => (<img src={row?.banner_image} alt="error" height={75} width={75} />)
            },
            {
                name: "Description",
                selector: (row) => row?.description,
                cell: (row) => (<div className="" dangerouslySetInnerHTML={{ __html: row.description }}></div>)
            },
            {
                name: "Slug",
                selector: (row) => row?.slug,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        {
                            showRestore && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                    <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreCategories', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteBlogCategory', data: row, softDelete: false })) }}> <i className="fe fe-trash"></i> </Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];

        const blogCategoryData = data?.data?.allTrash;
        console.log(blogCategoryData);
        const filteredData = blogCategoryData?.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

        const displayPages = () => {
            const pageButtons = [];
            const delta = 2;
            const left = currentPage - delta;
            const right = currentPage + delta + 1;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= left && i < right)) {
                    pageButtons.push(
                        <li key={i} className={currentPage === i ? "active" : ""}>
                            <Button className="btn btn-default" variant={currentPage === i ? "primary" : "default"} onClick={() => paginate(i)}>
                                {i}
                            </Button>
                        </li>
                    );
                } else if (i === left - 1 || i === right + 1) {
                    pageButtons.push(<li key={i} className="ellipsis_pagination">......</li>);
                }
            }
            return pageButtons;
        };
        const paginate = (pageNumber) => setCurrentPage(pageNumber);
        const nextPage = () => {
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
            }
        };
        const prevPage = () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        };
        const handlePageSizeChange = (e) => {
            const newSize = parseInt(e.target.value, 10);
            setPageSize(newSize);
            setCurrentPage(1);
        };

        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
        };
        return (
            <>
                <Row className="align-items-center">
                    <Col><PageHeader titles="Blogs Categories Trash" active="Blogs Categories Trash" items={["Home", "Blogs Categories"]} links={["/dashboard", "/blogs/categories"]} /></Col>
                </Row>
                <Card>
                    <Card.Body className="data_table">
                        <div className="e-table pb-5 table-responsive">
                            <Row className="m-5">
                                <Col as={Col} sm={9}>
                                    <span>Show</span>
                                    <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                                        {[10, 25, 50].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <span>Entries</span>
                                </Col>
                                <Col as={Col} sm={3}>
                                    <Form.Group className="mx-3">
                                        <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
                            <div className="pagination_wrapper">
                                <ul className="pagination">
                                    <li>
                                        <Button className="btn btn-default" variant="default" onClick={prevPage}>
                                            <i className="fa fa-angle-left"></i> Previous
                                        </Button>
                                    </li>
                                    {displayPages()}
                                    <li>
                                        <Button className="btn btn-default" variant="default" onClick={nextPage}>
                                            Next <i className="fa fa-angle-right"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </>
        );
    }
}