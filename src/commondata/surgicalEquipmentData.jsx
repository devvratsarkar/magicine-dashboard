import React, { useCallback, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useEditProductMutation, useImportSurgicalEquipmentMutation } from "../redux/features/productEndPoints";
import { Link } from "react-router-dom";
import { useGetManufactutrerQuery, useGetSurgicalEquipmentIDQuery, useGetSurgicalEquipmentQuery, useUpdateSurgicalEquipmentIDMutation } from "../redux/features/catalogueEndPoints";
import axios from "axios";
import { API_BASE_URL, MEDIA_BASE_URL, USER_BASE_URL } from "../utils/config";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import CustomDatePicker from "../layouts/layoutcomponents/CustomDatePicker";

export const SurgicalEquipmentDataTable = () => {
    const role = localStorage.getItem("role")
    const permissions = JSON.parse(localStorage.getItem("permissions"));
    const showimport = role === "Admin" || (role === "Staff" && permissions?.Sergical_Equipment?.includes("import"));
    const showExport = role === "Admin" || (role === "Staff" && permissions?.Sergical_Equipment?.includes("export"));
    const showAddTrash = role === "Admin" || (role === "Staff" && permissions?.Sergical_Equipment?.includes("add-trash"));
    const showEdit = role === "Admin" || (role === "Staff" && permissions?.Sergical_Equipment?.includes("edit"));

    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropzone, setShowDropzone] = useState(false)
    const [marketerId, setMarketerId] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [queryParams, setQueryParams] = useState({
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
    });
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetSurgicalEquipmentQuery(queryParams)
    const handleSubmit = (e) => {
        e.preventDefault();
        setQueryParams({ marketer: marketerId, status, fromDate, toDate });
    };
    const { data: manufacturer } = useGetManufactutrerQuery()
    const manufacturerData = manufacturer?.data?.manufacturer


    const SearchManufacturerOption = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.map((item) => ({
        value: item.id,
        label: item.manufacturer_name,
    })) : []

    const [editProduct, { isLoading: loading }] = useUpdateSurgicalEquipmentIDMutation()

    const handleExport = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/export-sergical`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'SurgicalEquipment.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success("Surgical Equipment exported successfully!");
        } catch (error) {
            console.log("error", error);
            toast.error("An error occurred during export.");
        }
    };

    const handleDemo = async () => {
        try {
            const response = await axios.get(`${MEDIA_BASE_URL}/public/sergical-equipment/csv/DemoSurgicalEquipment.csv`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'DemoProduct.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success("Demo Product csv downloaded successfully!");
        } catch (error) {
            toast.error("An error occurred during export.");
        }
    };

    const [uploadProduct, { isLoading: loadingImport }] = useImportSurgicalEquipmentMutation()
    const onDrop = useCallback(
        async (acceptedFiles) => {
            const formData = new FormData();
            formData.append("csvFile", acceptedFiles[0]);

            try {

                const resp = await uploadProduct(formData);
                console.log("response", resp);
                if (resp?.data?.http_status_code === 201) {
                    refetch()
                    toast.success("Products imported successfully!");
                }
            } catch (error) {
                toast.error("File upload failed");
            }
        },
        [uploadProduct]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".csv",
    });


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
                selector: (row, index) => `${index + serialNumber} {${row.id}}`,
                sortable: true,
            },
            {
                name: "Equipment Name",
                sortable: true,
                selector: (row) => row.product_name,
                cell: (row) => (
                    <Link to={`/catalogue/surgical-equipment/edit-surgical-equipment/${row.id}`}>{row?.product_name}</Link>
                )
            },
            {
                name: "Image",
                selector: (row) => row?.featured_image,
                cell: (row) => (
                    <img src={row.featured_image} width={50} height={50} />
                )
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
                    const { refetch: refetchSurgicalEquipment } = useGetSurgicalEquipmentIDQuery(row?.id, { refetchOnMountOrArgChange: true })
                    const [checked, setChecked] = useState(row?.status);
                    const handleStatusChange = async () => {
                        try {
                            setChecked(!checked);
                            const response = await editProduct({ equipmentID: row.id, updateEquipment: { status: !checked } });
                            if (response?.data?.http_status_code === 200) {
                                refetch()
                                refetchSurgicalEquipment()
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
                name: "Link",
                selector: (row) => (
                    <a
                        href={`${USER_BASE_URL}surgical-equipments/${row?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Click Here
                    </a>
                ),
                sortable: true,
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt,
                sortable: true,
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper d-flex justify-content-center">
                        <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                            <Link to={`/catalogue/surgical-equipment/view-surgical-equipment/${row.id}`}><Button className="btn btn-icon btn-primary"><i className="fe fe-eye"></i></Button></Link>
                        </OverlayTrigger>
                        {
                            showEdit && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to={`/catalogue/surgical-equipment/edit-surgical-equipment/${row.id}`}><Button className="btn btn-icon btn-warning border-warning"><i className="fe fe-edit"></i></Button></Link>
                                </OverlayTrigger>
                            )}
                        {
                            showAddTrash && (
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteSurgicalEquipment', data: row, softDelete: true })) }}> <i className="fe fe-trash"></i> </Button>
                                </OverlayTrigger>
                            )}
                    </div>
                ),
            },
        ];

        const productsData = data?.data?.length > 0 ? data?.data : [];

        const filteredData = productsData?.filter((item) => {
            const searchTermLower = searchTerm.toLowerCase();

            return (
                item?.product_name?.toLowerCase().includes(searchTermLower) ||
                item?.marketer?.manufacturer_name?.toLowerCase().includes(searchTermLower) ||
                item?.createdAt?.toString().toLowerCase().includes(searchTermLower) ||
                item?.id?.toString().toLowerCase().includes(searchTermLower)
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
                            <Button className="me-2 bg-warning text-white" variant="" onClick={handleDemo}>
                                <i className="fa fa-download"></i>
                            </Button>
                            {
                                showExport && (
                                    <Button
                                        className="btn btn-success text-white me-3 border-success"
                                        onClick={handleExport}
                                    >
                                        <i className="fa fa-download"></i> Export
                                    </Button>
                                )}
                            {
                                showimport ? (
                                    <Button
                                        className="btn btn-success text-white me-3 border-success"
                                        onClick={() => setShowDropzone(!showDropzone)}
                                    >
                                        <i className="fa fa-upload"></i> Import
                                    </Button>
                                ) : null
                            }
                            {loadingImport && <Loader />}

                            {showDropzone && (
                                <div className="file-upload-container">
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
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mt-5 mx-2 mb-4" style={{ rowGap: "10px" }}>
                            <Col lg={3} md={3} sm={5} xs={12}>
                                <Select
                                    name="marketer"
                                    options={SearchManufacturerOption}
                                    placeholder="Search By Manufacturer"
                                    isSearchable
                                    onChange={(selectedOption) => setMarketerId(selectedOption?.value)}
                                    value={SearchManufacturerOption.find(option => option.value === marketerId) || null}
                                />
                            </Col>
                            <Col lg={3} md={3} sm={5} xs={12}>
                                <Form.Select name="search_status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">Search By Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </Form.Select>
                            </Col>
                            <Col lg={2} md={6} sm={6} xs={12} className={`date-input-container ${!fromDate ? 'empty' : ''}`}>
                                <CustomDatePicker selectedDate={fromDate} setSelectedDate={setFromDate} placeholder="Date From" />
                            </Col>
                            <Col lg={2} md={6} sm={6} xs={12} className={`date-input-container ${!toDate ? 'empty' : ''}`}>
                                <CustomDatePicker selectedDate={toDate} setSelectedDate={setToDate} placeholder="Date To" />
                            </Col>
                            <Col lg={2} md={3} sm={2} xs={12}>
                                <Button type="submit" className="w-100">Search</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="justify-content-end">
                        <Col as={Col} sm={3}>
                            <Form.Group className="m-3">
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <DataTable data={currentItems} columns={COLUMNS} striped />
                    <div className="pagination_wrapper">
                        <Row>
                            <Col>
                                <p className="fw-bolder mx-3 mt-3">Total: - <span>{filteredData?.length}</span></p>
                            </Col>
                        </Row>
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
            </>
        );
    }
}