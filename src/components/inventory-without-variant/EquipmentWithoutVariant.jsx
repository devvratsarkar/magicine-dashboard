import React, { useCallback, useRef, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import Loader from "../../layouts/layoutcomponents/loader";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useGetAllInventoryWithoutVariantQuery, useUpdateInventoryBulkUploadMutation } from "../../redux/features/stockInventoryEndPoint";
import { generateEditInventoryWithVariantPage, generateViewInventoryWithoutVariantPage } from "../../utils/routes";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useDropzone } from "react-dropzone";
import moment from "moment";

export default function EquipmentWithoutVariant() {
    const [showDropzone, setShowDropzone] = useState(false)
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
    })



    const [uploadCsv, { isLoading: loadingCSVUpload }] = useUpdateInventoryBulkUploadMutation()

    const [currentPageEquipment, setCurrentPageEquipment] = useState(1);

    const [pageSizeEquipment, setPageEquipment] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermEquipment, setSearchTermEquipment] = useState("");

    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, refetch } = useGetAllInventoryWithoutVariantQuery(queryParam);


    const onDrop = useCallback(
        async (acceptedFiles) => {
            const formData = new FormData();
            formData.append("csv", acceptedFiles[0]);

            try {
                const resp = await uploadCsv(formData);
                if (resp?.data?.http_status_code === 200) {
                    setShowDropzone(false)
                    refetch()
                    toast.success("Products imported successfully!");
                }
            } catch (error) {
                toast.error("File upload failed");
            }
        },
        []
    );

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
            name: "Product Name",
            sortable: true,
            selector: (row) => row?.itemId?.product_name,
            cell: (row) => (<div>{row?.itemId?.product_name}</div>)
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
            selector: (row) => Number(row?.selling_price?.toFixed(2)),
        },
        {
            name: "Stock Quantity",
            selector: (row) => row?.stock_quantity,
        },
        {
            name: "CreatedAt",
            selector: (row) => row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A") : '',
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="action_icon_wrapper">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Link to={`${generateViewInventoryWithoutVariantPage()}/${row.id}`}><Button type="button" className="btn btn-icon  btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
                    </OverlayTrigger>
                    {
                        showEdit && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                <Link to={`${generateEditInventoryWithVariantPage()}/${row.id}`} className="action_icon"><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
                            </OverlayTrigger>
                        )
                    }
                    {
                        showAddTrash && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <Button type="button" className="btn btn-icon  btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteInventoryWithoutVariant', data: row, softDelete: true })) }}><i className="fe fe-trash text-white"></i></Button>
                            </OverlayTrigger>
                        )
                    }
                </div>
            ),
        },
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


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".csv",
    });



    return (
        <>
            {
                loadingCSVUpload && <Loader />
            }
            <div className="e-table pb-5 table-responsive">
                <Card className="mb-3">
                    <Card.Body>
                        <Row className="m-5">
                            {isLoading || isFetching ? <Loader /> : null}
                            <Col as={Col} sm={9}>
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
                            <Col as={Col} sm={3} className="text-end">
                                <Button onClick={() => setShowDropzone(!showDropzone)}>Update Inventory <span><i className="fe fe-download"></i></span></Button>
                            </Col>
                        </Row>

                        {showDropzone && (
                            <div className="file-upload-container mb-3">
                                <div
                                    {...getRootProps()}
                                    className={`dropzone ${isDragActive ? "active" : ""}`}
                                    style={{
                                        border: "2px dashed #007bff",
                                        borderRadius: "5px",
                                        padding: "20px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        marginTop: "20px",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <p>Drop the file here...</p>
                                    ) : (
                                        <p>Drag & drop a CSV file here, or click to select a file</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <Row className="mb-3">
                            <Col as={Col} md={9}>
                            </Col>
                            <Col as={Col} sm={3}>
                                <Form.Group className="mx-3">
                                    <Form.Control type="text" placeholder="Search..." value={searchTermEquipment} onChange={handleSearchEquipment} />
                                </Form.Group>
                            </Col>
                        </Row>

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
                    </Card.Body>
                </Card>

            </div>
        </>
    );
}