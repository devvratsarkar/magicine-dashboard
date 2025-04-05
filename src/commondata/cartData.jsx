import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useGetAllCartsQuery } from "../redux/features/cartApiEndPoint";
import DataTable from "react-data-table-component";
import { openModal } from "../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader"
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/config";
import moment from "moment";


export const CartData = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllCartsQuery()
  const [serialNumber, setSerialNumber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showExport = role === "Admin" || (role === "Staff" && permissions.Cart.includes("export"))
  const showView = role === "Admin" || (role === "Staff" && permissions.Cart.includes("view"))



  const COLUMNS = [
    {
      name: "#",
      selector: (row, index) => index + serialNumber,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row?.user?.name,
      sortable: true,
    },
    {
      name: "No. Of Items",
      selector: (row) => row?.item_count,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row?.total_quantity,
      sortable: true,
    },
    {
      name: "Grand Total",
      selector: (row) => {
        if (row.currency === "USD") {
          return `$.${Number(row?.total_amount).toFixed(2)}`
        } else {
          return `Rs.${Number(row?.total_amount).toFixed(2)}`
        }
      },
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
          {
            showView && (
              <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                <Button className="btn btn-icon btn-primary" onClick={() => { dispatch(openModal({ componentName: 'ViewCart', data: row })) }}><i className="fe fe-eye"></i></Button>
              </OverlayTrigger>
            )}
        </div >
      ),
    },
  ];


  const handleExport = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/export-cart`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'AbandonedCart.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Products exported successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const productsData = data?.data || []
  const itemsPerPage = pageSize;
  const totalPages = Math.ceil(productsData?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productsData?.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <>
      {
        isLoading && <Loader /> || loading && <Loader />
      }
      <div className="e-table pb-5 table-responsive">
        <Row className="justify-content-end mt-3 mx-2">
          {
            showExport && (
              <Button
                className="btn btn-success text-white w-auto border-success"
                onClick={handleExport}
              >
                <i className="fa fa-download"></i>Export
              </Button>
            )}
        </Row>
        <div className="d-block ms-5 mb-4">
          <span>Show </span>
          <select
            className="mx-2"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>

          <span>Entries</span>
        </div>
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
