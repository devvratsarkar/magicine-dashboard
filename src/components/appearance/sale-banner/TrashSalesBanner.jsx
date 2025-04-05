import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useGetTrashSalesBannerQuery, useUpdateSalesBannerMutation } from "../../../redux/features/cmsEndPoints";
import { openModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link } from "react-router-dom";


export const TrashSalesBanner = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetTrashSalesBannerQuery()
    const [updateSalesBanner, { isLoading: loading }] = useUpdateSalesBannerMutation()

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.Notification.includes("restore-trash"))
    const showRestore = role === "Admin" || (role === "Staff" && permissions.Notification.includes("edit"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Notification.includes("delete"))

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
                selector: (row) => row?.id,
                sortable: true,
            },
            {
                name: "Banner Image",
                selector: (row) => row?.banner_image,
                cell: (row) => (
                    <img src={row.banner_image} width={75} height={75} />
                )
            },

            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [checked, setChecked] = useState(row?.status);
                    const handleStatusChange = async () => {
                        try {
                            setChecked(!checked);
                            const response = await updateSalesBanner({ bannerID: row.id, updatedBanner: { status: !checked } });
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
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreSalesBanner', data: row, softDelete: true })) }} className="btn btn-icon btn-warning" variant="">
                                        <i className="fa fa-refresh"></i>
                                    </Button>
                                </OverlayTrigger>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button
                                        className="btn btn-icon btn-danger"
                                        variant=""
                                        onClick={() => { dispatch(openModal({ componentName: 'DeleteSalesBanner', data: row, softDelete: false })) }}
                                    >
                                        <i className="fe fe-trash text-light"></i>
                                    </Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];

        const SalesBannerData = data?.data?.allSalesBanner

        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(SalesBannerData?.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = SalesBannerData?.slice(indexOfFirstItem, indexOfLastItem);

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
                <Row>
                    <Col>
                        <Row className="align-items-center">
                            <Col>
                                <PageHeader
                                    titles="Sales Banner"
                                    active="Sales Banner  Trash List"
                                    items={["Home",]}
                                    links={["/dashboard"]}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body className="slae_banner_table p-0">
                                <div className="e-table pb-5 table-responsive">
                                    {loading && <Loader />}
                                    <Row className="my-3 mx-2 ">
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
                    </Col>
                </Row >
            </>
        );
    }
}