import React, { useState } from 'react'
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { useGetAllPopUpsQuery, useGetLoginDataQuery, useGetSinglePOPUPQuery, useUpdatePopupMutation } from '../redux/features/popUpEndpoints';
import { Link } from 'react-router-dom';
import Loader from '../layouts/layoutcomponents/loader';
import { useDispatch } from 'react-redux';
import { openModal } from '../redux/slices/allModalSlice';
import toast from 'react-hot-toast';

export default function LoginDataTale() {

    const dispatch = useDispatch()
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetLoginDataQuery()
    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={Error} />;
    }

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row, index) => serialNumber + index,
                sortable: true,
            },
            {
                name: "Name",
                sortable: true,
                cell: (row) => row?.name
            },
            {
                name: "Email",
                sortable: true,
                cell: (row) => row?.email
            },
            {
                name: "Phone Number",
                sortable: true,
                cell: (row) => row?.phone_number
            },
            {
                name: "IP",
                sortable: true,
                cell: (row) => row?.IP
            },
            {
                name: "Created At",
                sortable: true,
                cell: (row) => row?.createdAt
            },
        ];

        const notFoundSearch = data?.data || []
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(notFoundSearch?.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = notFoundSearch?.slice(indexOfFirstItem, indexOfLastItem);

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
            <div className="e-table pb-5 table-responsive">
                {isLoading && <Loader />}
                <Row className="mt-3 mx-2 align-items-center my-3">
                    <Col as={Col} sm={5} xs={12}>
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
        )
    }
}
