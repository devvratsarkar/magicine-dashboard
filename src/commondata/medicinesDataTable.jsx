import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useEditMedicineMutation, useEditProductMutation, useGetMedicinesQuery, useGetSingleMedicinesQuery, useImportMedicineMutation, useImportProductMutation, useUpdateMedicineStatusMutation } from "../redux/features/productEndPoints";
import { Link } from "react-router-dom";
import { useGetBrandQuery, useGetManufactutrerQuery } from "../redux/features/catalogueEndPoints";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL, MEDIA_BASE_URL, USER_BASE_URL } from "../utils/config";
import moment from "moment";
import Select from "react-select";
import CustomDatePicker from "../layouts/layoutcomponents/CustomDatePicker";

export const MedicineDataTable = () => {
  const debounceTimeout = useRef(null);
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showExport = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("export"))
  const showImport = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("import"))
  const showEdit = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("edit"))
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Medicine.includes("add-trash"))

  const [serialNumber, setSerialNumber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropzone, setShowDropzone] = useState(false)
  const [brandId, setBrandId] = useState("");
  const [marketerId, setMarketerId] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [queryParams, setQueryParams] = useState({
    brand: '',
    marketer: '',
    status: '',
    fromDate: '',
    toDate: '',
    search: '',
    page: "" || 1,
    limit: "" || 10
  });
  const [queryBrand, setQuerybrand] = useState({
    type: "Medicine",
    status: true
  })
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetMedicinesQuery(queryParams)
  const handleSubmit = (e) => {
    e.preventDefault();
    setQueryParams((prevState) => ({
      ...prevState,
      brand: brandId,
      marketer: marketerId,
      status,
      fromDate,
      toDate,
      slimit: "" || 10,
      page: "" || 1,
    }));
  };

  useEffect(() => {
    refetch()
  }, [isSuccess])

  const [editMedicine, { isLoading: loading }] = useUpdateMedicineStatusMutation()
  const { data: manufacturer } = useGetManufactutrerQuery()
  const { data: brand } = useGetBrandQuery(queryBrand)
  const manufacturerData = manufacturer?.data?.manufacturer
  const brandData = brand?.data?.allBrand;

  const searchBrandOptiion = Array.isArray(brandData) && brandData?.length > 0 ? brandData?.map((item) => ({
    value: item.id,
    label: item.brand_name,
  })) : []

  const searchOptionManufacturer = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.map((item) => ({
    value: item.id,
    label: item.manufacturer_name,
  })) : []


  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/export-medicine`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Medicine.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Medicines exported successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleDemo = async () => {
    try {
      const response = await axios.get(`${MEDIA_BASE_URL}/public/medicine/csv/DemoMedicine.csv`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'DemoMedicine.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Demo Medicines csv downloaded successfully!");
    } catch (error) {
      toast.error("An error occurred during export.");
    }
  };

  const [uploadProduct, { isLoading: loadingImport }] = useImportMedicineMutation()
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      formData.append("csvFile", acceptedFiles[0]);

      try {

        const resp = await uploadProduct(formData);
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
        selector: (row, index) => `${serialNumber + index} {${row.id}}`,
        sortable: true,
      },
      {
        name: "Product Name",
        sortable: true,
        cell: (row) => (<Link to={`/catalogue/edit-medicines/${row.id}`} >{row?.product_name}</Link>)
      },
      {
        name: "Image",
        selector: (row) => row?.featured_image,
        cell: (row) => (
          <img src={row.featured_image} width={75} height={75} />
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
          const { refetch: singleMedicineFetch } = useGetSingleMedicinesQuery(row.id, { refetchOnMountOrArgChange: true })

          const handleStatusChange = async (newStatus) => {
            try {
              const response = await editMedicine({ formData: { status: newStatus }, medicineId: row.id });
              if (response?.data?.http_status_code === 200) {
                singleMedicineFetch()
                refetch()
                toast.success(response.data.message)
              }
            } catch (error) {
              console.error(error);
            }
          }

          return (
            <>{
              showEdit ? (
                <select value={selectedStatus} onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  handleStatusChange(e.target.value);
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
        name: "IsReviewed",
        selector: (row) => row?.is_reviewed ? "true" : "false",
        sortable: true,
      },
      {
        name: "Reviewed By",
        selector: (row) => row?.review_by?.name,
        sortable: true,
      },
      {
        name: "Link",
        selector: (row) => (
          <a
            href={`${USER_BASE_URL}${row?.form?.name.toLowerCase()}/${row?.slug}`}
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
        selector: (row) => row && row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY [at] hh:mm A") : null,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/catalogue/view-medicines/${row.id}`}><Button type="button" className="btn btn-icon  btn-primary" variant=""><i className="fe fe-eye"></i></Button></Link>
            </OverlayTrigger>
            {
              showEdit && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <Link to={`/catalogue/edit-medicines/${row.id}`}><Button type="button" className="btn btn-icon btn-warning" variant=""><i className="fe fe-edit"></i></Button></Link>
                </OverlayTrigger>
              )
            }
            {
              showAddTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button className="btn btn-con btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteMedicine', data: row, softDelete: true })) }}> <i className="fe fe-trash"></i> </Button>
                </OverlayTrigger>
              )
            }
          </div>
        ),
      },
    ];

    const medicineData = data?.data?.filteredMedicine
    const paginationData = data?.data

    const filteredData = medicineData?.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();

      return (
        item?.product_name?.toLowerCase().includes(searchTermLower) ||
        item?.brand?.brand_name?.toLowerCase().includes(searchTermLower) ||
        item?.marketer?.manufacturer_name?.toLowerCase().includes(searchTermLower) ||
        item?.createdAt?.toLowerCase().includes(searchTermLower)
      );
    });

    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(paginationData?.totalPages);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData || [];

    const displayPages = () => {
      const pageButtons = [];
      const delta = 2;
      const left = Math.max(1, currentPage - delta);
      const right = Math.min(totalPages, currentPage + delta);

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
          pageButtons.push(
            <li key={i} className={currentPage === i ? "active" : ""}>
              <Button
                className="btn btn-default"
                variant={currentPage === i ? "primary" : "default"}
                onClick={() => {
                  setQueryParams({
                    ...queryParams,
                    page: i
                  })
                  setCurrentPage(i)
                }}
              >
                {i}
              </Button>
            </li>
          );
        } else if (i === left - 1 || i === right + 1) {
          pageButtons.push(
            <li key={i} className="ellipsis_pagination">...</li>
          );
        }
      }
      return pageButtons;
    }


    const nextPage = () => {

      if (currentPage < totalPages) {
        setQueryParams((prevState) => ({
          ...prevState,
          page: currentPage + 1,
        }))
        setCurrentPage(currentPage + 1)
      }
    };

    const prevPage = () => {
      if (currentPage > 1) {
        setQueryParams((prevState) => ({
          ...prevState,
          page: currentPage - 1,
        }))
        setCurrentPage(currentPage - 1)
      }
    };

    const handlePageSizeChange = (e) => {
      const newSize = parseInt(e.target.value, 10);
      setPageSize(newSize);
      setQueryParams((prevState) => ({
        ...prevState,
        limit: newSize,
        page: 1,
      }));
      setCurrentPage(1);
    };

    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }


      debounceTimeout.current = setTimeout(() => {
        setQueryParams({
          ...queryParams,
          search: value,
        });
        setCurrentPage(1);
      }, 1000);
    };

    return (
      <>
        <div className="e-table pb-5 table-responsive">
          {loading && <Loader />}
          <Row className="justify-content-between mt-3 mx-2 align-items-center">
            <Col as={Col} sm={5} xs={12}>
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

            <Col sm={6} xs={12} className="text-sm-end d-flex gap-3 justify-content-end">
              <Button className="me-2 bg-warning text-white" variant="" onClick={handleDemo}>
                <i className="fa fa-download"></i>
              </Button>
              {
                showExport && (
                  <Button
                    className="btn btn-success text-white me-3 border-success me-0"
                    onClick={handleExport}
                  >
                    <i className="fa fa-download"></i> Export
                  </Button>
                )
              }
              {
                showImport && (
                  <Button
                    className="btn btn-success text-white me-3 border-success me-0"
                    onClick={() => setShowDropzone(!showDropzone)}
                  >
                    <i className="fa fa-upload"></i> Import
                  </Button>
                )
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
            <Row className="mt-5 mx-2" style={{ rowGap: "10px" }}>
              <Col lg={2} md={3} sm={5} xs={12}>
                <Select
                  name="brand"
                  options={searchBrandOptiion}
                  isSearchable
                  placeholder="Search By Brand"
                  onChange={(selectedOption) => setBrandId(selectedOption?.value)}
                  value={searchBrandOptiion.find(option => option.value === brandId) || null}
                />
              </Col>
              <Col lg={2} md={3} sm={5} xs={12}>
                <Select
                  name="marketer"
                  options={searchOptionManufacturer}
                  placeholder="Search By Manufacturer"
                  isSearchable
                  onChange={(selectedOption) => setMarketerId(selectedOption?.value)}
                  value={searchOptionManufacturer.find(option => option.value === marketerId) || null}
                />
              </Col>
              <Col lg={2} md={3} sm={5} xs={12}>
                <Form.Select name="search_status" onChange={(e) => setStatus(e.target.value)} value={status}>
                  <option value="">Search By Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={6} sm={6} xs={12}>
                <CustomDatePicker selectedDate={fromDate} setSelectedDate={setFromDate} placeholder="Date From" />
              </Col>
              <Col lg={2} md={6} sm={6} xs={12}>
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
          <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
          <div className="pagination_wrapper">
            <Row>
              <Col>
                <p className="fw-bolder mx-3 mt-3">Total: - <span>{paginationData?.totalItems}</span></p>
              </Col>
            </Row>
            <ul className="pagination">
              <li>
                <Button
                  className="btn btn-default"
                  variant="default"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <i className="fa fa-angle-left"></i> Previous
                </Button>
              </li>
              {displayPages()}
              <li>
                <Button
                  className="btn btn-default"
                  variant="default"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
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