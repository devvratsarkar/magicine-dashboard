import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useGetTagsQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";

export const TagsDataTable = () => {
    const [serialNumber, setSerialnUmber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetTagsQuery();

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.Tags.includes("edit"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Tags.includes("delete"))

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
                selector: (row, index) => `${serialNumber + index} {${row?.id}}`,
                sortable: true,
            },
            {
                name: "Name",
                selector: (row) => row.name,
                sortable: true,
            },
            {
                name: "Count",
                selector: (row) => row.count,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        {
                            showEdit && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Button onClick={() => { dispatch(openModal({ componentName: 'EditTag', data: row })) }}>
                                        <i className="fe fe-edit"></i>
                                    </Button>
                                </OverlayTrigger>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'TagsDelete', data: row, })) }}><i className="fe fe-trash text-white"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];
        const tagsData = data?.data || [];
        // const filteredData = Array.isArray(tagsData) && tagsData?.filter((tag) =>
        //     tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //     tag?.count
        // );

        const filteredData = tagsData?.filter((item) => {
            const searchTermLower = searchTerm.toLowerCase();
            const searchTermNumber = parseFloat(searchTerm);

            return (
                item?.name?.toLowerCase().includes(searchTermLower) ||
                // item.attribute_name.toLowerCase().includes(searchTermLower) ||
                (!isNaN(searchTermNumber) && item.count === searchTermNumber)
            );
        })

        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredData && filteredData?.slice(indexOfFirstItem, indexOfLastItem);

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
                <div className="e-table pb-5 table-responsive">
                    <Row className="justify-content-end my-3 mx-2 align-items-center">
                        <Col as={Col} sm={6} xs={12}>
                            <div className="d-block ms-5">
                                <span>Show</span>
                                <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                                    {[10, 25, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <span>Entries</span>
                            </div>
                        </Col>
                        <Col as={Col} sm={6} xs={12} className="text-sm-end">
                        </Col>
                        <Col as={Col} sm={3} className="mt-4">
                            <Form.Group className="mx-3">
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <DataTable data={currentItems} columns={COLUMNS} striped />
                    <div className="pagination_wrapper">

                        <Row>
                            <Col>
                                <p className="fw-bolder mx-3 mt-3">Total: - <span>{filteredData?.length}</span></p>
                            </Col>
                        </Row>
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
            </>
        );
    }
};