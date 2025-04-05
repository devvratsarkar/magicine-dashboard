import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useEditMedicineMutation, useEditProductMutation, useGetMedicinesQuery } from "../../redux/features/productEndPoints";
import { Link } from "react-router-dom";
import { useGetDeletedMedicinesQuery } from "../../redux/features/productEndPoints";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

export const MedicineTrash = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [serialNumber, setserialNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetDeletedMedicinesQuery()
    const [editMedicine, { isLoading: loading }] = useEditMedicineMutation()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === 'Admin' || (role === "Staff" && permissions.Medicine.includes("edit"))
    const showDelete = role === 'Admin' || (role === "Staff" && permissions.Medicine.includes("delete"))
    const showRestore = role === 'Admin' || (role === "Staff" && permissions.Medicine.includes("restore-trash"))

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
                selector: (row, index) => `${serialNumber + index} {${row.id}}`,
                sortable: true,
            },
            {
                name: "Product Name",
                sortable: true,
                cell: (row) => (<Link to={row?.slug} >{row?.product_name}</Link>)
            },
            {
                name: "Image",
                selector: (row) => row?.featured_image,
                cell: (row) => (
                    <img src={row.featured_image} width={70} height={70} />
                )
            },
            {
                name: "Brand",
                selector: (row) => row?.brand?.brand_name,
                sortable: true,
            },
            {
                name: "Manufacturer",
                selector: (row) => row?.marketer?.manufacturer_name,
                sortable: true,
            },
            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [selectedStatus, setSelectedStatus] = useState(row.status);
                    return (
                        <>
                            {
                                showEdit ? (
                                    <select value={selectedStatus} onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        handleStatusChange(row.id, e.target.value);
                                    }}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                ) : (
                                    <select value={selectedStatus} onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        handleStatusChange(row.id, e.target.value);
                                    }}
                                        disabled
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                )
                            }
                        </>
                    )
                }
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
                                <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreMedicine', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteMedicine', data: row, softDelete: false })) }}> <i className="fe fe-trash"></i> </Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];
        const handleStatusChange = async (id, newStatus) => {
            try {
                const response = await editMedicine({ medicineData: { status: newStatus }, medicineId: id });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message)
                }
            } catch (error) {
                console.error(error);
            }
        }

        const medicineData = data?.data?.trashMedicine
        const filteredData = medicineData?.filter((item) =>
            item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Row className="align-items-center">
                    <Col>
                        <PageHeader titles="Medicines" active="Medicine Trash" items={["Home", "Medicine List"]} links={["/dashboard", "/catalogue/medicines"]} />
                    </Col>
                </Row>
                <Card>
                    <Card.Body className="data_table">
                        <div className="e-table pb-5 table-responsive">
                            {loading && <Loader />}
                            <Row className="justify-content-end mt-3 mx-2 align-items-center">
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
                                    {/* <Button className="btn btn-success text-white me-3 border-success">
                                        <i className="fa fa-download"></i> Export
                                    </Button>
                                    <Button className="btn btn-success text-white me-3 border-success">
                                        <i className="fa fa-upload"></i> Import
                                    </Button> */}
                                </Col>
                            </Row>
                            {/* <Form>
                                <Row className="my-5 mx-2" style={{ rowGap: "10px" }}>
                                    <Col as={Col} lg={5} md={5} sm={5} xs={12}>
                                        <Form.Control
                                            name="search_brand"
                                            placeholder="Search By Date"
                                        />
                                    </Col>
                                    <Col as={Col} lg={5} md={5} sm={5} xs={12}>
                                        <Form.Select
                                            name="search_status"
                                        >
                                            <option value="" >Search By Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </Form.Select>
                                    </Col>
                                    <Col as={Col} lg={2} md={2} sm={2} xs={12}>
                                        <Button type="submit" className="w-100">
                                            Search
                                        </Button>
                                    </Col>
                                </Row>
                            </Form> */}
                            <Row className="justify-content-end mb-5">
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
                    </Card.Body>
                </Card>
            </>
        );
    }
}