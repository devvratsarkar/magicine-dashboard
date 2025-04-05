import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useGetDeletedInventoryWithoutVariantQuery } from "../../redux/features/stockInventoryEndPoint";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import moment from "moment";

export const InventoryWithoutVariantTrash = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching } = useGetDeletedInventoryWithoutVariantQuery();

    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showRestore = role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("restore-trash"))
    const showDelete = role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient?.includes("delete"))

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
            name: "Product Name",
            selector: (row) => row?.itemId?.product_name,
            sortable: true,
        },
        {
            name: "Image",
            cell: (row) => (<img src={row?.itemId?.featured_image} width={50} height={50} alt="error" />)
        },
        {
            name: "SKU",
            selector: (row) => row?.sku,
            sortable: true,
        },
        {
            name: "Selling Price",
            selector: (row) => row?.selling_price,
        },
        {
            name: "Stock Quantity",
            selector: (row) => row?.stock_quantity,
        },
        {
            name: "Updated",
            selector: (row) => row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "",
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action_icon_wrapper">
                    {
                        showRestore && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                                <Button onClick={() => { dispatch(openModal({ componentName: 'RestoreInventoryWithoutVariant', data: row, })) }} className="btn btn-icon btn-warning" variant=""><i className="fa fa-refresh"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showDelete && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteInventoryWithoutVariant', data: row, softDelete: false, })) }} ><i className="fe fe-trash text-light"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
    ];
    const inventoryWithoutVariantData = Array.isArray(data?.data) ? data.data : [];
    const indexedData = inventoryWithoutVariantData.map((item, index) => ({ ...item, index }));
    const filteredData = indexedData.filter((item) =>
        item?.itemId?.product_name?.toLowerCase()?.includes(searchTerm.toLowerCase())
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

    const returnBack = () => {
        navigate(-1)
    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <PageHeader titles="Inventory" active="Inventory without variant trash" items={['Home', "Inventory"]} links={["/dashboard", returnBack]} />
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