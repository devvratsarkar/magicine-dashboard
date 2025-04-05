
import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useEditCarrierMutation, useGetAllCarrierQuery, useGetDeletedCarrierQuery } from "../../../redux/features/shippingZoneEndPoints";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import toast from "react-hot-toast";

export const CarrierTrash = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching } = useGetDeletedCarrierQuery();
    const [editCarrier, { isLoading: loading }] = useEditCarrierMutation()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.Carrier.includes("edit"))
    const showRestore = role === "Admin" || (role === "Staff" && permissions.Carrier.includes("restore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Carrier.includes("delete"))


    if (isError) {
        return <Error error_mes={error} />;
    }
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
            cell: (row) => (<p>{row?.name}</p>)
        },
        {
            name: "Logo",
            selector: (row) => row?.logo,
            cell: (row) => (<img src={row?.logo} width={50} height={50} alt="error" />)
        },
        {
            name: "Tracking Url",
            selector: (row) => row?.tracking_url,
            cell: (row) => (<p className="">{row?.tracking_url}</p>)
        },
        {
            name: "Phone",
            selector: (row) => row?.phone,
            sortable: true
        },
        {
            name: "Email",
            selector: (row) => row?.email,
            cell: (row) => (<p> {row?.email}</p>),
            sortable: true
        },
        {
            name: "Status",
            selector: (row) => row.status,
            cell: (row) => {
                const [checked, setChecked] = useState(row?.status);
                const handleStatusChange = async () => {
                    try {
                        setChecked(!checked);
                        const response = await editCarrier({ carrierId: row.id, carrierData: { status: !checked } });
                        if (response?.data?.http_status_code === 200) {
                            toast.success(response.data.message)
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
                    {
                        showRestore && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreCarrier', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showDelete && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteCarrier', data: row, softDelete: false })) }}> <i className="fe fe-trash"></i> </Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
    ];
    const carrierData = Array.isArray(data?.data) ? data.data : [];
    const indexedData = carrierData.map((item, index) => ({ ...item, index }));
    const filteredData = indexedData.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <Row className="align-items-center">
                <Col>
                    <PageHeader titles="Shipping- Carrier Trash" active="Carrier trash" items={["Home", "Carrier List"]} links={["/dashboard", "/shipping/carrier"]} />
                </Col>
                {/* <Col className="text-end d-flex justify-content-end gap-1">
                    <Link to="/shipping/carrier/add-new-carrier" className="btn btn-success text-white me-3" > Add New </Link>
                    <Link className="btn btn-danger text-white border-danger" to={"/soft-delete"}>Carrier Trashed</Link>
                </Col> */}
            </Row>
            <Card>
                <div className="e-table pb-5 table-responsive">
                    <Row className="m-5">
                        {isLoading || isFetching || loading ? <Loader /> : null}
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
            </Card>
        </>
    );
}