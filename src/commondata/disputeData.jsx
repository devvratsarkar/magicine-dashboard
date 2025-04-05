import React, { useCallback, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useEditProductMutation, useGetProductsQuery, useImportProductMutation } from "../redux/features/productEndPoints";
import { Link } from "react-router-dom";
import { useGetBrandQuery, useGetManufactutrerQuery } from "../redux/features/catalogueEndPoints";
import { API_BASE_URL, USER_BASE_URL } from "../utils/config";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useGetAllDisputesQuery } from "../redux/features/disputeEndPoint";

export const DisputeDataTable = () => {
    // const [showDropzone, setShowDropzone] = useState(false)
    const [serialNumber, setSerialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllDisputesQuery();
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))


    const showSingleView = role === "Admin" || (role === "Staff" && permissions.NeedHelp.includes("view"));
    const showReply = role === "Admin" || (role === "Staff" && permissions.NeedHelp.includes("edit"));


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
                selector: (row, index) => index + serialNumber,
                sortable: true,
            },
            {
                name: "Order Id",
                sortable: true,
                selector: (row) => row?.orderId
            },
            {
                name: "Customer Name",
                sortable: true,
                cell: (row) => row?.created_by?.name
            },
            {
                name: "Status",
                selector: (row) => {
                    if (row?.status == "open") {
                        return (
                            <button className="btn custum-paid-color text-light">{row?.status}</button>
                        )
                    }
                    else if (row?.status == "pending") {
                        return (
                            <button className="btn custum-pending-color text-light px-5">{row?.status}</button>
                        )
                    }
                    else {
                        return (
                            <button className="btn custum-failed-color text-light px-4">{row?.status}</button>
                        )
                    }
                },
                sortable: true,
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper d-flex justify-content-center">
                        {
                            showSingleView && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                                    <Link to={`/dispute/view-disputes/${row?.id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
                                </OverlayTrigger>
                            )
                        }{
                            showReply && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Button className="btn btn-icon btn-warning border-warning" onClick={() => { dispatch(openModal({ componentName: 'ReplyDisputeMessage', data: row })) }}><i className="fa fa-mail-reply"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];

        const disputeData = data?.data;


        const filteredData = disputeData?.filter((item) => {
            const searchTermLower = searchTerm.toLowerCase();

            return (
                item?.created_by?.name?.toLowerCase().includes(searchTermLower) ||
                item?.orderId?.toString()?.toLowerCase().includes(searchTermLower) ||
                item?.createdAt?.toString()?.toLowerCase().includes(searchTermLower)
            );
        });



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
                <div className="e-table pb-5 table-responsive">
                    {isLoading && <Loader />}
                    <Row className="justify-content-end mt-3 mx-2 align-items-center">
                        <Col sm={6} xs={12}>
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
                        <Col sm={6} xs={12} className="text-sm-end">

                        </Col>
                    </Row>
                    <Row className="justify-content-end">
                        <Col sm={3}>
                            <Form.Group className="m-3">
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

    return null;
};