import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { useGetJobPositionIdQuery, useGetJobPositionQuery, useUpdateJobPositionMutation } from "../redux/features/cmsEndPoints";


export const JobPositionDataTable = () => {

    const [serialNumber, setSerialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.Position.includes("edit"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Position.includes("delete"))


    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetJobPositionQuery()

    const [updateJobPosition, { isLoading: loading }] = useUpdateJobPositionMutation();

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
                selector: (row, index) => (index + serialNumber),
            },
            {
                name: "Title",
                selector: (row) => row.title,
            },
            {
                name: "Banner Image",
                selector: (row) => row?.banner_image,
                cell: (row) => (
                    <img src={row.banner_image} width={75} height={75} alt="product" />
                )
            },
            {
                name: "Work Type",
                selector: (row) => row.work_type,
            },
            {
                name: "No. Of Position",
                selector: (row) => row.no_positions,
            },
            {
                name: "Category",
                selector: (row) => row.category,
            },
            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [checked, setChecked] = useState(row?.status);
                    const { refetch: jobApplicationRefetch } = useGetJobPositionIdQuery(row?.id, { refetchOnMountOrArgChange: true })
                    const handleStatusChange = async () => {
                        try {
                            setChecked(!checked);
                            const response = await updateJobPosition({ positionId: row.id, positionData: { status: !checked } });
                            if (response?.data?.http_status_code === 200) {
                                refetch()
                                jobApplicationRefetch()
                                toast.success(response.data.message);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    return (
                        <>
                            {
                                showEdit ? (
                                    <label className="custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-switch-input"
                                            onChange={handleStatusChange}
                                            checked={checked}
                                        />
                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                    </label>
                                ) : (
                                    <label className="custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-switch-input"
                                            onChange={handleStatusChange}
                                            checked={checked}
                                            disabled
                                        />
                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                    </label>
                                )
                            }
                        </>

                    )
                },
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                            <Link to={`/cms/job-position/view/${row?.id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
                        </OverlayTrigger>{
                            showEdit && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to={`/cms/job-position/edit/${row?.id}`}><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
                                </OverlayTrigger>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteJobPosition', data: row })) }}><i className="fe fe-trash text-white"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];
        const jobPositionData = Array.isArray(data?.data) && data.data.length > 0 ? data.data : [];
        const filteredData = jobPositionData.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(jobPositionData);
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
                    {loading && <Loader /> || isLoading && <Loader />}
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
            </>
        );
    };
};
