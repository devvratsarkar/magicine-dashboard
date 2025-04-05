import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useGetDeletedNotificationQuery } from "../../../redux/features/supportDeskEndPoint";
import { openModal } from "../../../redux/slices/allModalSlice";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

export const NotificationTrash = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching } = useGetDeletedNotificationQuery();

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
            selector: (row) => row?.title,
            cell: (row) => (<div>{row?.title}</div>)
        },
        {
            name: "Content",
            selector: (row) => row?.content,
            cell: (row) => (<div dangerouslySetInnerHTML={{ __html: row?.content || '' }}></div>)
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
                    <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreNotification', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteNotifiation', data: row, softDelete: false })) }}> <i className="fe fe-trash text-light"></i> </Button>
                    </OverlayTrigger>
                </div>
            ),
        },
    ];
    const notificationData = Array.isArray(data?.data) ? data.data : [];
    const indexedData = notificationData.map((item, index) => ({ ...item, index }));
    const filteredData = indexedData.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <PageHeader titles="Support Desk" active="Notification Trash" items={["Home", "Notification List"]} links={["/dashboard", "/support-desk/notification"]} />
                </Col>
            </Row>
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
        </>
    );
}
