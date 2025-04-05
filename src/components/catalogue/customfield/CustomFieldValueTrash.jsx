import React, { useState } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Nav, OverlayTrigger, Tabs, Tab, Row, Card, Col, Button, Form, Tooltip, } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { openModal } from "../../../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import { useGetCustomFieldsValueDeletedItemsQuery } from "../../../redux/features/catalogueEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";

export default function CustomFieldValueTrash() {
    const [serialNumber, setSerialNumber] = useState(1)
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetCustomFieldsValueDeletedItemsQuery(id)
    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = role === "Admin" || (role === "Staff" && permissions.CustomFiledValue.includes("restore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.CustomFiledValue.includes("delete"))

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row, index) => `${index + serialNumber} {${row?.id}}`,
                sortable: true
            },
            {
                name: "Order",
                selector: (row) => row?.list_order,
                sortable: true
            },
            {
                name: "Values",
                selector: (row) => row?.attribute_name,
                sortable: true
            },
            {
                name: "Color",
                selector: (row) => row?.color,
                sortable: true
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        {
                            showRestore && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                    <Button onClick={() => { dispatch(openModal({ componentName: 'CustomFieldValueRestore', data: { row, id }, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                        {
                            showDelete && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteFieldValue', data: { row, id }, softDelete: false, })) }} ><i className="fe fe-trash text-light"></i></Button>
                                </OverlayTrigger>
                            )
                        }
                    </div>
                ),
            },
        ];
        const customFieldsData = data?.data
        const filteredData = customFieldsData?.filter((item) =>
            item.attribute_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <PageHeader titles="Custom Field Trash" active="Custom Field Value Trash" items={["Home", "Custom Field List"]} links={["/dashboard", "/catalogue/Custom-field/"]} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body className="data_table">
                                <div className="e-table pb-5 table-responsive">
                                    {/* {loading && <Loader />} */}
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
    }
}
