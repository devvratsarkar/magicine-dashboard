import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useGetDeletedPushNotificationQuery } from "../../../redux/features/supportDeskEndPoint";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

export const PushNotificationTrash = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching } = useGetDeletedPushNotificationQuery();


    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = role === "Admin" || (role === "Staff" && permissions.Notification.includes("restore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.Notification.includes("delete"))

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
            name: "Title",
            sortable: true,
            selector: (row) => row?.type,
            cell: (row) => (<div>{row?.type}</div>)
        },
        {
            name: "Content",
            selector: (row) => row?.content,
            cell: (row) => (<div dangerouslySetInnerHTML={{ __html: row?.content }}></div>)
        },
        {
            name: "Dated",
            selector: (row) => row?.date,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row?.status,
            cell: (row) => (
                <div className="action_icon_wrapper">
                    <button className={`notification_status notification_status_${row.status}`} variant="">{row?.status}</button>
                </div>
            )
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action_icon_wrapper">
                    {
                        showRestore && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                <Button onClick={() => { dispatch(openModal({ componentName: 'RestorePushNotification', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showDelete && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeletedPushNotification', data: row, softDelete: false })) }}> <i className="fe fe-trash text-light"></i> </Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
    ];
    const notificationData = Array.isArray(data?.data) ? data.data : [];
    const indexedData = notificationData.map((item, index) => ({ ...item, index }));



    const stripHtml = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    const filteredData = indexedData.filter((item) =>
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.content && stripHtml(item.content).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.date && item.date.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        <Button className="btn btn-default" variant="default" onClick={() => paginate(i)}>
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
                    <PageHeader titles="Support Desk- Push Notification Trash" active="Push Notification Trash" items={["Home", "Push Notification List"]} links={["/dashboard", "/push-notification"]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <div className="e-table pb-5 table-responsive">
                            <Row className="m-5">
                                {isLoading || isFetching ? <Loader /> : null}
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
                </Col>
            </Row>
        </>
    );
}