import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { useEditManufactutrerMutation, useGetManufacturerByIdQuery, useGetManufactutrerQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

export const ManufacturerDataTable = () => {
  const [serialNumber, setSerialNumber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: marketerAllRefetch } = useGetManufactutrerQuery()
  const [editManufactutrer, { isLoading: loading }] = useEditManufactutrerMutation()

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))


  const showEdit = role === "Admin" || (role === "Staff" && permissions.Marketer.includes("edit"))
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Marketer.includes("add-trash"))


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
        name: "Marketer/Manufacturer Name",
        selector: (row) => row.manufacturer_name,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const { refetch } = useGetManufacturerByIdQuery(row?.id, { refetchOnMountOrArgChange: true })
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editManufactutrer({ manufactutrerId: row.id, manufactutrerData: { status: !checked } });
              if (response?.data?.http_status_code === 200) {
                refetch()
                marketerAllRefetch()
                toast.success("Marketer Status updated successfully")
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
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper d-flex justify-content-center">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <span className="action_icon">
                <Button onClick={() => { dispatch(openModal({ componentName: 'ViewManufacturer', data: row })) }} className="btn btn-icon btn-primary">
                  <i className="fe fe-eye"></i>
                </Button>
              </span>
            </OverlayTrigger>
            {
              showEdit && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <span className="action_icon">
                    <Button onClick={() => { dispatch(openModal({ componentName: 'EditManufacturer', data: row })) }} className="btn btn-icon btn-warning border-warning">
                      <i className="fe fe-edit"></i>
                    </Button>
                  </span>
                </OverlayTrigger>
              )
            }
            {
              showAddTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <span className="action_icon">
                    <Button className="btn btn-icon btn-danger" variant="" onClick={() => { dispatch(openModal({ componentName: 'DeleteManufacturer', data: row, softDelete: true, })) }} >
                      <i className="fe fe-trash text-light"></i>
                    </Button>
                  </span>
                </OverlayTrigger>
              )
            }
          </div>
        ),
      },
    ];

    const manufacturerData = data?.data?.manufacturer || []
    const filteredData = manufacturerData.filter((item) =>
      item.manufacturer_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      </>
    );
  }
}