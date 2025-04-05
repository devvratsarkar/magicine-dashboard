import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useGetAllTrashUsesQuery } from '../../../redux/features/catalogueEndPoints';
import { openModal } from '../../../redux/slices/allModalSlice';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import Loader from '../../../layouts/layoutcomponents/loader';

export default function TrashUsesList() {
    const dispatch = useDispatch()
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllTrashUsesQuery()
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = role === "Admin" || (role === "Staff" && permissions.Uses.includes("restore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Uses.includes("delete"))

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
                    {
                        showRestore && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                <Button className="btn btn-icon btn-warning" variant='' onClick={() => { dispatch(openModal({ componentName: `UsesRestore`, data: row })) }}><i className="fa fa-refresh"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showDelete && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteUses', data: row, softDelete: false })) }}> <i className="fe fe-trash text-white"></i></Button>
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
            <Row>
                <Col>
                    <PageHeader titles="Catalogue- Uses Trash" active="Uses Trash List" items={["Home"]} links={["/dashboard"]} />
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <div className="e-table table-responsive">
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
                        {/* <Card.Footer> */}
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
                        {/* </Card.Footer> */}
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};
