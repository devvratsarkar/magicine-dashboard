import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useGetAllPrescriptionsQuery } from "../redux/features/customerDataEndPoints";
import DataTable from "react-data-table-component";
import Loader from "../layouts/layoutcomponents/loader";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { useGetMedicineOnlyQuery, useGetMedicinesQuery } from "../redux/features/productEndPoints";

export const PrescriptionRequestData = () => {
  const [totalItem, setTotalItem] = useState(0);
  const [medicineQuery, setMedicineQuery] = useState({
    brand: '',
    marketer: '',
    status: '',
    fromDate: '',
    toDate: '',
  });

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    setMedicineQuery({
      email: email,
      medicine: medicine,
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllPrescriptionsQuery(medicineQuery);
  const [serialNumber, setSerialNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [medicine, setMedicine] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  const { data: medicineData } = useGetMedicineOnlyQuery();
  const medicineList = medicineData?.data || null;

  useEffect(() => {
    if (medicineData?.data?.totalItems) {
      setTotalItem(medicineData.data.totalItems);
    }
  }, [medicineData]);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/export-prescription`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "export-prescriptions.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Prescriptions exported successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const COLUMNS = [
    {
      name: "#",
      selector: (row, index) => index + serialNumber,
      sortable: true,
    },
    {
      name: "Customer Name",
      sortable: true,
      selector: (row) => row?.name,
    },
    {
      name: "Medicine Name",
      selector: (row) => row?.product_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row?.contact_no,
      sortable: true,
    },
    {
      name: "Requested On",
      selector: (row) => row?.requested_on,
      sortable: true,
    },
  ];

  const productsData = data?.data || [];
  const filteredData = productsData?.filter((item) =>
    item?.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      {isLoading && <Loader />}
      <div className="e-table pb-5 table-responsive">
        <Row className="justify-content-between mt-3 mx-2">
          <Col as={Col} xs={12} sm={6} className="order-sm-2 text-end">
            <Button className="btn btn-success text-white w-auto border-success" onClick={handleExport}>
              <i className="fa fa-download"></i>&nbsp;Export
            </Button>
          </Col>
          <Col as={Col} xs={12} sm={6} className="order-sm-1">
            <div className="d-block ms-5">
              <span>Show </span>
              <select
                className="mx-2"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e)}
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span> Entries</span>
            </div>
          </Col>
        </Row>
        <Form className="mb-4" onSubmit={handleSubmitFilter}>
          <Row className="mt-5 mx-2" style={{ rowGap: "5px" }}>
            <Col as={Col} md={3}>
              <Form.Control
                name="email"
                placeholder="Search By Email ID"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
            <Col as={Col} md={3}>
              <Form.Select
                name="medicine"
                onChange={(e) => setMedicine(e.target.value)}
              >
                <option value="">Search by Medicine Name</option>
                {medicineList &&
                  medicineList.length > 0 &&
                  medicineList.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.product_name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col lg={2} md={6} sm={6} xs={12} className={`date-input-container ${!fromDate ? "empty" : ""}`}>
              <Form.Control
                type="date"
                className="date-input"
                onChange={(e) => setFromDate(e.target.value)}
                name="fromDate"
                max={new Date().toISOString().split("T")[0]}
              />
              <span className="placeholder">Date From</span>
            </Col>
            <Col lg={2} md={6} sm={6} xs={12} className={`date-input-container ${!toDate ? "empty" : ""}`}>
              <Form.Control
                type="date"
                className="date-input"
                onChange={(e) => setToDate(e.target.value)}
                name="toDate"
                max={new Date().toISOString().split("T")[0]}
              />
              <span className="placeholder">Date To</span>
            </Col>
            <Col as={Col} md={2}>
              <Button type="submit" className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>

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
    </>
  );
};
