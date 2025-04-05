import React, { useState } from "react";
import { Button, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { openModal } from "../../../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useEditCouponMutation, useGetDeletedCouponDataQuery } from "../../../redux/features/catalogueEndPoints";


export const CouponDeletedItems = () => {
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const [editCoupon, { isLoading: loading }] = useEditCouponMutation()
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetDeletedCouponDataQuery()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("restore-trash"))
    const showEdit = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("edit"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Coupons.includes("delete"))

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
                selector: (row, index) => `${index + serialNumber} {${row?.id}}`,
                sortable: true
            },
            {
                name: "Coupon Code",
                selector: (row) => row.couponCode,
            },
            {
                name: "Coupon Type",
                selector: (row) => row.couponType,
            },
            {
                name: "Value",
                selector: (row) => row?.value,
            },
            {
                name: "Expiry Date",
                selector: (row) => row?.expirey_date,
            },
            {
                name: "No. of Coupon",
                selector: (row) => row?.number_coupon,
            },
            {
                name: "Remaining Coupon",
                selector: (row) => row?.number_coupon,
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt,
            },
            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [checked, setChecked] = useState(row?.status);
                    const handleStatusChange = async () => {
                        try {
                            setChecked(!checked);
                            const response = await editCoupon({ couponId: row.id, couponData: { status: !checked } });
                            if (response?.data?.http_status_code === 200) {
                                toast.success(response.data.message)
                                refetch()
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
                        <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                            <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreCoupon', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteCoupon', data: row, softDelete: false })) }} ><i className="fe fe-trash text-light"></i></Button>
                        </OverlayTrigger>
                    </div>
                ),
            },
        ];
        const couponData = data?.data?.trashCoupon
        const filteredData = couponData?.filter((item) => {
            const search = searchTerm.trim().toLowerCase();

            return (
                item.couponCode.toLowerCase().includes(search) ||
                item.couponType.toLowerCase().includes(search) ||
                item.value.toString().toLowerCase().includes(search) ||
                item.expirey_date.toLowerCase().includes(search) ||
                item.number_coupon.toString().includes(search) ||
                item.createdAt.toLowerCase().includes(search)
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
                <Row className="align-items-center">
                    <Col>
                        <PageHeader titles="Coupons" active="Deleted Coupon List" items={["Home", "Coupon List"]} links={["/dashboard", "/coupon"]} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body className="data_table">
                                <div className="e-table pb-5 table-responsive">
                                    {loading && <Loader />}
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    };
};
