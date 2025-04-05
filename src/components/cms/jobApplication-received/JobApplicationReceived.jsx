import React, { useState } from 'react';
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { openModal } from '../../../redux/slices/allModalSlice';
import Loader from '../../../layouts/layoutcomponents/loader';
import Error from '../../../layouts/layoutcomponents/Error';
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useGetAllJobApplicationQuery } from '../../../redux/features/cmsEndPoints';
import { MEDIA_BASE_URL } from '../../../utils/config';
import axios from 'axios';

function JobApplicationReceived() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const { data, isError, error, isLoading, isFetching } = useGetAllJobApplicationQuery();
    const allJobApplications = data?.data || [];

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showExport = role === "Admin" || (role === "Staff" && permissions.Application.includes("export"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Application.includes("delete"))


    const handleDownloadResume = async (resume, fileName) => {
        try {
            const response = await axios.get(`${MEDIA_BASE_URL}/${resume}`, {
                responseType: 'blob',
            });

            const mimeType = response.headers['content-type'] || 'application/octet-stream';
            const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success("Resume Downloaded successfully.!");
        } catch (error) {
            toast.error("An error occurred during Download.");
        }
    };



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
            name: "Job Title",
            selector: (row) => row?.job_title,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row?.email,
            sortable: true,
        },
        {
            name: "Contact No",
            selector: (row) => row?.contact_no,
            sortable: true,
        },
        {
            name: "Applied ON",
            selector: (row) => row?.createdAt,
            sortable: true,
        },
        {
            name: "Resume",
            selector: (row) => (
                <>
                    {
                        showExport ? (
                            <i
                                className='fa fa-download text-primary fs-4 cursor-pointer'
                                onClick={() => window.open(`${MEDIA_BASE_URL}/${row?.resume}`, '_blank')}
                            >
                            </i>
                        ) : (
                            <i className='fa fa-download text-primary fs-4 cursor-pointer'></i>
                        )
                    }

                </>
            ),
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action_icon_wrapper">
                    {
                        showDelete && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteJobApplication', data: row })) }}><i className="fe fe-trash text-white"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
    ];

    const jobApplicationData = allJobApplications;
    const filteredData = jobApplicationData?.filter((item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError) {
        return <Error error_mes={error} />;
    }

    return (
        <>
            <Row>
                <Col md={6}>
                    <PageHeader titles="Job Application" active="Job Application Received List" items={["Home"]} links={['/dashboard']} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <div className="e-table pb-5 table-responsive">
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
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {allJobApplications.length === 0 ? (
                                    <div className="text-center py-5">
                                        <h5>No job applications available.</h5>
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
}

export default JobApplicationReceived;
