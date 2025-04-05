import React, { useState } from 'react'
import { useGetAllFormQuery, useGetAllUsesQuery } from '../redux/features/catalogueEndPoints';
import DataTable from 'react-data-table-component';
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openModal } from '../redux/slices/allModalSlice';
import Loader from '../layouts/layoutcomponents/loader';

export default function FormDataTable() {
    const dispatch = useDispatch()
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllFormQuery()
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))
    const showEdit = role === "Admin" || (role === "Staff" && permissions.Form.includes("edit"));
    const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Form.includes("add-trash"));

    const COLUMNS = [
        {
            name: "#",
            selector: (row, index) => `${index + serialNumber} {${row?.id}}`,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row?.name,
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
                <div className="action_icon_wrapper">

                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Button className="btn btn-icon btn-primary" onClick={() => { dispatch(openModal({ componentName: `ViewForm`, data: row })) }}><i className="fe fe-eye"></i></Button>
                    </OverlayTrigger>
                    {
                        showEdit && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                <Button className="btn btn-icon btn-warning border-warning" onClick={() => { dispatch(openModal({ componentName: 'EditForm', data: row })) }}><i className="fe fe-edit"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showAddTrash && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteForm', data: row, softDelete: true })) }}> <i className="fe fe-trash text-white"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
    ];


    const productsData = data?.data || []
    const filteredData = productsData?.filter((item) =>
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
            {isLoading && <Loader />}
            <div className="e-table pb-5 table-responsive">
                <Row className="justify-content-between mt-3 mx-2 mb-4">
                    <Col as={Col} xs={12} sm={6} className="order-sm-2 text-end">
                    </Col>
                    <Col as={Col} xs={12} sm={6} className="order-sm-1">
                        <div className="d-block ms-5">
                            <span>Show </span>
                            <select
                                className="mx-2"
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                            >
                                {[10, 25, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                            <span>Entries</span>
                        </div>
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
        </>
    );
};
