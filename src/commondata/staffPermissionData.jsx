import React, { useState } from 'react'
import { Col, Row, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Loader from '../layouts/layoutcomponents/loader';
import DataTable from 'react-data-table-component';
import { useGetAllStaffQuery } from '../redux/features/staffEndPoint';
import { Link } from 'react-router-dom';

export default function StaffPermissionDataTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const { data, isLoading } = useGetAllStaffQuery()
    const staffData = data?.data || []

    const COLUMNS = [
        {
            name: "#",
            selector: (row) => row.index + 1,
            sortable: true,
            sortFunction: (a, b) => b.index - a.index,
        },
        {
            name: "Name",
            sortable: true,
            selector: (row) => row?.name,
            cell: (row) => (<div>{row?.name}</div>)
        },
        {
            name: "Profile Picture",
            selector: (row) => row?.profile_pic,
            cell: (row) => (<img src={row?.profile_pic} width={70} height={70} />)
        },
        {
            name: "Email Id",
            selector: (row) => row?.email,
            cell: (row) => (<div>{row?.email}</div>),
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: (row) => row?.phone_number,
            cell: (row) => (<div>{row?.phone_number}</div>),
            sortable: true,
        },
        {
            name: "DOB",
            selector: (row) => row?.dob,
            cell: (row) => (<div>{row?.dob}</div>),
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) =>
            (
                < div className="action_icon_wrapper" >
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link to={`/view-staff-permissions/${row.id}`} ><Button type="button" className="btn btn-icon btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Link to={`/edit-staff-permissions/${row.id}`}><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
                    </OverlayTrigger>
                </div >
            ),
        },
    ];

    const customerData = Array.isArray(staffData) ? staffData : [];
    const indexedData = customerData.map((item, index) => ({ ...item, index }));
    const filteredData = indexedData?.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Row className="justify-content-end m-2 d-flex align-items-center">
                    <Col>
                        <div className="d-block">
                            <span>Show </span>
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
    )
}

