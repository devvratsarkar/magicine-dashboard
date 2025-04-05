import React, { useState } from 'react'
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import PageHeader from '../../../../layouts/layoutcomponents/pageheader'
import { useDispatch } from 'react-redux'
import { openModal } from '../../../../redux/slices/allModalSlice'
import Loader from '../../../../layouts/layoutcomponents/loader'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import { useGetAllBlogsTagsQuery } from '../../../../redux/features/blogsEndPoints'
import { getBlogTagViewPage } from '../../../../utils/routes'

export default function BlogTags() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllBlogsTagsQuery();

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showAdd = role === "Admin" || (role === "Staff" && permissions.BlogTags.includes("add"))
    const showEdit = role === "Admin" || (role === "Staff" && permissions.BlogTags.includes("edit"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.BlogTags.includes("delete"))

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
                selector: (row) => row?.name,
                sortable: true,
            },
            {
                name: "Count",
                selector: (row) => row?.count,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                            <Link to={`${getBlogTagViewPage()}/${row.id}`}><Button type="button" className="btn btn-icon  btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
                        </OverlayTrigger>
                        {
                            showEdit && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Button type="button" className="btn btn-icon btn-warning" variant="" onClick={() => { dispatch(openModal({ componentName: 'EditBlogTags', data: row, })) }}><i className="fe fe-edit"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'BlogTagsDelete', data: row })) }}> <i className="fe fe-trash"></i> </Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];
        const tagsData = Array.isArray(data?.data) ? data.data : [];
        const filteredData = tagsData?.filter((tag) =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Row className='align-items-center'>
                    <Col>
                        <PageHeader titles="Blog Tags" active="Blog Tags List" items={["Home"]} links={["/dashboard"]} />
                    </Col>
                    <Col className='text-end'>
                        {
                            showAdd && (
                                <Button className='btn btn-success' variant='' onClick={() => { dispatch(openModal({ componentName: 'AddBlogTags' })) }}>Add New Blog Tag </Button>
                            )
                        }
                    </Col>
                </Row>
                <Row>
                    <Card className='data_table'>
                        <Card.Body>
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
                                <DataTable data={currentItems} columns={COLUMNS} striped />
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
                </Row>
            </>
        )
    }
}
