import React, { useRef, useState } from 'react'
import { Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import { useGetInventoryReportQuery } from '../../../redux/features/stockInventoryEndPoint';
import { useDispatch } from 'react-redux';
import Loader from '../../../layouts/layoutcomponents/loader';
import moment from 'moment';
import { API_BASE_URL } from '../../../utils/config';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EquipmentReport() {

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadFromDate, setDownloadFromDate] = useState('');
    const [downloadToDate, setDownloadToDate] = useState('');

    const debounceTimeout = useRef(null);
    const [queryParam, setQueryParam] = useState({
        medicinepage: "" || 1,
        medicinelimit: "" || 10,
        medicinesearch: "",
        productpage: "" || 1,
        productlimit: "" || 10,
        productsearch: "",
        equipmentpage: "" || 1,
        equipmentlimit: "" || 10,
        equipmentsearch: "",
        fromDate: "",
        toDate: ""
    })

    const [currentPageEquipment, setCurrentPageEquipment] = useState(1);

    const [pageSizeEquipment, setPageEquipment] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermEquipment, setSearchTermEquipment] = useState("");

    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching } = useGetInventoryReportQuery(queryParam);
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"))

    const showEdit = role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient?.includes("edit"))
    const showAddTrash = role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient?.includes("add-trash"))

    const COLUMNS = [
        {
            name: "#",
            selector: (row) => row.index + 1,
            sortable: true,
            sortFunction: (a, b) => b.index - a.index,
        },
        {
            name: "Product id",
            sortable: true,
            selector: (row) => row?.itemId?.id,
            cell: (row) => (<div>{row?.itemId?.id}</div>)
        },
        {
            name: "Product Name",
            sortable: true,
            selector: (row) => row?.itemId?.product_name,
            cell: (row) => (<div>{row?.itemId?.product_name}</div>)
        },
        {
            name: "manufacturer Name",
            sortable: true,
            selector: (row) => row?.itemId?.brand?.brand_name,
            cell: (row) => (<div>{row?.itemId?.brand?.brand_name}</div>)
        },
        {
            name: "SKU",
            selector: (row) => row?.sku,
        },
        {
            name: "Selling Price",
            selector: (row) => Number(row?.selling_price?.toFixed(2)),
        },
        {
            name: "Opening Stock",
            selector: (row) => row?.openingStock,
        },
        {
            name: "Closing Stock",
            selector: (row) => row?.closingStock,
        },
        {
            name: "CreatedAt",
            selector: (row) => moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A"),
        },
        // {
        //     name: "Action",
        //     cell: (row) => (
        //         <div className="action_icon_wrapper">

        //             <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
        //                 <Link to={"/inventory/without-variant/Equipment/Product/2254"}>
        //                     <Button className="btn btn-icon btn-primary" >
        //                         <i className="fe fe-eye"></i>
        //                     </Button>
        //                 </Link>
        //             </OverlayTrigger>
        //         </div >
        //     ),
        // },
    ];

    const inventoryWithoutVariantDataEquipment = Array.isArray(data?.data?.equipment?.equipmentdata) ? data?.data?.equipment?.equipmentdata : [];
    const paginationDataEquipment = data?.data?.equipment?.pagination


    const indexedDataEquipment = inventoryWithoutVariantDataEquipment.map((item, index) => ({ ...item, index }));


    const filteredDataEquipment = indexedDataEquipment.filter((item) =>
        item.itemId?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || item.selling_price?.toString().includes(searchTerm) || item.stock_quantity?.toString().includes(searchTerm) || item.createdAt?.toString().includes(searchTerm)
    );


    const totalPagesEquipment = Math.ceil(paginationDataEquipment?.totalPages);

    const currentItemsEquipment = filteredDataEquipment || [];


    const displayPagesEquipment = () => {
        const pageButtons = [];
        const delta = 2;
        const left = currentPageEquipment - delta;
        const right = currentPageEquipment + delta + 1;

        for (let i = 1; i <= totalPagesEquipment; i++) {
            if (i === 1 || i === totalPagesEquipment || (i >= left && i < right)) {
                pageButtons.push(
                    <li key={i} className={currentPageEquipment === i ? "active" : ""}>
                        <Button className="btn btn-default" variant={currentPageEquipment === i ? "primary" : "default"} onClick={() => {
                            setQueryParam({ ...queryParam, equipmentpage: i }),
                                setCurrentPageEquipment(i)
                        }}>
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

    const nextPageEquipment = () => {
        if (currentPageEquipment < totalPagesEquipment) {
            setQueryParam({ ...queryParam, equipmentpage: currentPageEquipment + 1 }),
                setCurrentPageEquipment(currentPageEquipment + 1);
        }
    };

    const prevPageEquipment = () => {
        if (currentPageEquipment > 1) {
            setQueryParam({ ...queryParam, equipmentpages: currentPageEquipment - 1 }),
                setCurrentPageEquipment(currentPageEquipment - 1);
        }
    };


    const handlePageSizeChangeEquipment = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageEquipment(newSize);
        setCurrentPageEquipment(1);

        setQueryParam({
            ...queryParam,
            equipmentlimit: newSize
        })

    };

    const handleSearchEquipment = (e) => {
        const value = e.target.value;
        setSearchTermEquipment(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }


        debounceTimeout.current = setTimeout(() => {
            setQueryParam({
                ...queryParam,
                equipmentsearch: value,
            });
            setCurrentPageEquipment(1);
        }, 1000);
    };


    const handleSearchDateFilter = (e) => {
        e.preventDefault();
        setQueryParam((prev) => ({
            ...prev,
            fromDate: fromDate,
            toDate: toDate
        }));
    };




    const handleDownloadReport = async () => {
        if (!downloadFromDate || !downloadToDate) {
            alert('Please select both From Date and To Date before downloading.');
            return;
        }

        try {
            const response = await axios.get(
                `${API_BASE_URL}/download-inventory-report?type=Equipment&fromDate=${downloadFromDate}&toDate=${downloadToDate}`,
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'text/csv',
                    },
                }
            );

            console.log("Response:", response);

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `inventory_report_product_${moment().format('YYYYMMDD')}.csv`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setShowDownloadModal(false);
            toast.success('Inventory report downloaded successfully.');
        } catch (err) {
            toast.error(err?.response?.status === 404 ? "No Inventory Data Available" : 'An error occurred while downloading the report. Please try again.');
        }
    };


    return (
        <>
            <>
                <Row>
                    <Col as={Col} md={6}>
                        <PageHeader titles="Inventory Reporting" active="Equipment Report" items={["Home"]} links={["/dashboard"]} />
                    </Col>
                </Row>

                <Row>
                    <Col >
                        <Card>
                            <Card.Body>
                                <Row className="m-5">
                                    {isLoading || isFetching ? <Loader /> : null}
                                    <Col as={Col} sm={6}>
                                        <span>Show</span>
                                        <select className="mx-2" value={pageSizeEquipment} onChange={handlePageSizeChangeEquipment}>
                                            {[10, 25, 50].map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                        <span>Entries</span>
                                    </Col>
                                    <Col as={Col} md={6}>
                                        <Form onSubmit={handleSearchDateFilter}>
                                            <Row>
                                                <Col as={Col} md={5}>
                                                    <Form.Group>
                                                        <Form.Label>From Date</Form.Label>
                                                        <Form.Control type='date' name='fromDate' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col as={Col} md={5}>
                                                    <Form.Group>
                                                        <Form.Label>To Date</Form.Label>
                                                        <Form.Control type='date' name='toDate' value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                                <Col as={Col} md={2} className='d-flex align-items-end' >
                                                    {/* <Row className='h-full align-items-end'> */}
                                                    <Button type='submit'>Submit</Button>
                                                    {/* </Row> */}
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>

                                </Row>


                                <Row className='mb-3'>
                                    <Col as={Col} md={8}>
                                    </Col>
                                    <Col as={Col} sm={4}>
                                        <Row>
                                            <Col as={Col} md={2}>
                                                <Button variant="primary" onClick={() => setShowDownloadModal(true)}>
                                                    <i className='fe  fe-download'></i>
                                                </Button>
                                            </Col>
                                            <Col as={Col} md={10}>
                                                <Form.Group className="mx-3">
                                                    <Form.Control type="text" placeholder="Search..." value={searchTermEquipment} onChange={handleSearchEquipment} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>


                                {/* <Row className='mb-3'>
                                    <Col as={Col} md={9}></Col>
                                    <Col as={Col} md={3}>
                                        <Form.Group className="mx-3">
                                            <Form.Control type="text" placeholder="Search..." value={searchTermEquipment} onChange={handleSearchEquipment} />
                                        </Form.Group>
                                    </Col>
                                </Row> */}

                                <DataTable data={currentItemsEquipment} columns={COLUMNS} striped fixedHeader />
                                <div className="pagination_wrapper">
                                    <ul className="pagination">
                                        <li>
                                            <Button className="btn btn-default" variant="default" disabled={currentPageEquipment === 1} onClick={prevPageEquipment}>
                                                <i className="fa fa-angle-left"></i> Previous
                                            </Button>
                                        </li>
                                        {displayPagesEquipment()}
                                        <li>
                                            <Button className="btn btn-default" variant="default" disabled={currentPageEquipment === totalPagesEquipment} onClick={nextPageEquipment}>
                                                Next <i className="fa fa-angle-right"></i>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>

                                <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)}>
                                    <Modal.Header closeButton className='bg-primary'>
                                        <Modal.Title className='text-light mb-0'>Download Inventory Report</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={(e) => { e.preventDefault(); handleDownloadReport(); }}>
                                            <Form.Group controlId="formDownloadFromDate">
                                                <Form.Label>From Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={downloadFromDate}
                                                    onChange={(e) => setDownloadFromDate(e.target.value)}
                                                    max={moment().format('YYYY-MM-DD')}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formDownloadToDate" className="mt-3">
                                                <Form.Label>To Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={downloadToDate}
                                                    onChange={(e) => setDownloadToDate(e.target.value)}
                                                    min={downloadFromDate}
                                                    max={moment().format('YYYY-MM-DD')}
                                                />
                                            </Form.Group>
                                            <div className='text-end'>
                                                <Button variant="primary" type="submit" className="mt-3">
                                                    Download
                                                </Button>
                                            </div>
                                        </Form>
                                    </Modal.Body>
                                </Modal>



                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        </>
    )
}