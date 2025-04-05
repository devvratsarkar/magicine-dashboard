import React, { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetCustomFieldsQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";


export const CustomFieldDataTable = () => {
  const [serialNumber, setSerialnUmber] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetCustomFieldsQuery()

  // const [editBrand, { isLoading: loading }] = useEditCategoryMutation();

  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showEdit = role === "Admin" || (role === "Staff" && permissions.CustomFiled.includes("edit"))
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.CustomFiled.includes("add-trash"))
  const showView = role === "Admin" || (role === "Staff" && permissions.CustomFiledValue.includes("view"))

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
        name: "Order",
        selector: (row) => row?.list_order,
        sortable: true,
      },
      {
        name: "Name",
        selector: (row) => row?.attribute_name,
        sortable: true,
      },
      {
        name: "Type",
        selector: (row) => row?.attribute_type,
        sortable: true
      },
      {
        name: "Category",
        selector: (row) => row?.category,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            {showView && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Add Custom Field Value</Tooltip>} >
                <Link to={`/catalogue/custom-field-value/${row._id}`} className="action_icon" ><Button className="btn btn-icon btn-primary"> <i className="fe fe-plus-square"></i> </Button></Link>
              </OverlayTrigger>
            )
            }
            {
              showEdit && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <Button onClick={() => { dispatch(openModal({ componentName: 'EditCustomField', data: row })) }} className="btn btn-icon btn-warning border-warning"><i className="fe fe-edit"></i></Button>
                </OverlayTrigger>
              )
            }
            {
              showAddTrash && (
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button className="btn btn-icon btn-danger border-danger" onClick={() => { dispatch(openModal({ componentName: 'DeleteField', data: row, softDelete: true })) }} > <i className="fe fe-trash"></i> </Button>
                </OverlayTrigger>
              )
            }
          </div>
        ),
      },
    ];
    const customFieldsData = data?.data
    const filteredData = customFieldsData?.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchTermNumber = parseFloat(searchTerm);

      return (
        item.attribute_name.toLowerCase().includes(searchTermLower) ||
        item.attribute_type.toLowerCase().includes(searchTermLower) ||
        item.category.toLowerCase().includes(searchTermLower) ||
        (!isNaN(searchTermNumber) && item.list_order === searchTermNumber)
      );
    })
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
      </>
    );
  };
};