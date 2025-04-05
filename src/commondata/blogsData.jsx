import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Row, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useEditBlogMutation, useGetAllBlogsQuery, useGetSingleBlogsQuery } from "../redux/features/blogsEndPoints";
import { USER_BASE_URL } from "../utils/config";

export const BlogsData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);


  const [toggleCleared, setToggleCleared] = useState(false);
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllBlogsQuery();
  const [editBlog, { isLoading: loading }] = useEditBlogMutation();

  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions"));

  const showEdit = role === "Admin" || (role === "Staff" && permissions.Blog.includes("edit"));
  const showAddTrash = role === "Admin" || (role === "Staff" && permissions.Blog.includes("add-trash"));

  const handleRowSelected = (state) => {
    setSelectedRows(state?.selectedRows);
  };


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
        selector: (row) => row?.id,
        sortable: true,
      },
      {
        name: "Title",
        sortable: true,
        selector: (row) => row?.title,
        cell: (row) => <div>{row?.title}</div>,
      },
      {
        name: "Banner Image",
        selector: (row) => row?.featured_image,
        cell: (row) => <img src={row?.banner_image} width={70} height={70} alt="Banner" />,
      },
      {
        name: "Excerpt",
        selector: (row) => row?.excerpt,
        cell: (row) => <div dangerouslySetInnerHTML={{ __html: row?.excerpt || "" }} />,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const [checked, setChecked] = useState(row?.status);
          const { refetch: refetchSingleBlogs } = useGetSingleBlogsQuery(row?.id);
          const handleStatusChange = async () => {
            try {
              setChecked(!checked);
              const response = await editBlog({ blogId: row.id, blogData: { status: !checked } });
              if (response?.data?.http_status_code === 200) {
                refetch();
                refetchSingleBlogs();
                toast.success(response.data.message);
              }
            } catch (error) {
              console.error(error);
            }
          };
          return (
            <>
              {showEdit ? (
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
              )}
            </>
          );
        },
      },
      {
        name: "Date",
        selector: (row) => row?.createdAt,
        sortable: true,
      },
      {
        name: "Live Link",
        selector: (row) => (
          <a href={`${USER_BASE_URL}blogs/${row?.slug}`} target="_blank" rel="noopener noreferrer">
            Click Here
          </a>
        ),
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link to={`/view-blogs/${row.id}`}>
                <Button type="button" className="btn btn-icon btn-primary" variant="">
                  <i className="fe fe-eye"></i>
                </Button>
              </Link>
            </OverlayTrigger>
            {showEdit && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <Link to={`/edit-blogs/${row.id}`}>
                  <Button type="button" className="btn btn-icon btn-warning" variant="">
                    <i className="fe fe-edit"></i>
                  </Button>
                </Link>
              </OverlayTrigger>
            )}
            {showAddTrash && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                <Button
                  className="btn btn-con btn-danger border-danger"
                  onClick={() => {
                    dispatch(openModal({ componentName: "DeleteBlog", data: row, softDelete: true }));
                  }}
                >
                  <i className="fe fe-trash"></i>
                </Button>
              </OverlayTrigger>
            )}
          </div>
        ),
      },
    ];

    const blogData = Array.isArray(data?.data) ? data.data : [];
    const filteredData = blogData?.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        {loading && <Loader />}
        <div className="e-table pb-5 table-responsive">
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

          <Row className="justify-content-end px-5">
            {selectedRows.length > 0 && (
              <Button
                variant="danger"
                onClick={() => {
                  const selectedIds = selectedRows.map((row) => row.id);
                  dispatch(openModal({ componentName: "BulkDelete", data: selectedIds }));
                }}
                className="mb-3 w-auto text-light"
              >
                Delete Selected ({selectedRows.length})
              </Button>
            )}

          </Row>

          <DataTable
            data={currentItems}
            columns={COLUMNS}
            striped
            fixedHeader
            selectableRows
            selectableRowsHighlight
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
          />

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
};