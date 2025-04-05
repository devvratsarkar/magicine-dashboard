import React, { Component, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import bannerImage from "../assets/images/dashboard/image 144.png";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import { Link } from "react-router-dom";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Title",
    accessor: "TITLE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Banner Image",
    accessor: "BANNERIMAGE",
    className: "text-center wd-15p border-bottom-0",
    Cell: ({ value }) => (
      <img
        src={value}
        alt="Product Image"
        className={`inventory_product_image`}
      />
    ),
  },
  {
    Header: "Type",
    accessor: "TYPE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Date and Time",
    accessor: "DATETIME",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

export const DATATABLE = [
  {
    ID: "1",
    TITLE: "Landing Page",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "2",
    TITLE: "Protein Drinks",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "3",
    TITLE: "Hair Care",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "4",
    TITLE: "Face Serums",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "5",
    TITLE: "Facewash and cleanser",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "6",
    TITLE: "Protein Drinks",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "7",
    TITLE: "Hair Care",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "8",
    TITLE: "Face Serums",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "9",
    TITLE: "Protein Drinks",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "10",
    TITLE: "Facewash and cleanser",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "11",
    TITLE: "Hair Care",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "12",
    TITLE: "Facewash and cleanser",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "13",
    TITLE: "Hair Care",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "14",
    TITLE: "Protein Drinks",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
  {
    ID: "15",
    TITLE: "Facewash and cleanser",
    BANNERIMAGE: bannerImage,
    TYPE: "Landing page",
    DATETIME: "01/01/2023",
  },
];

export const PageData = () => {
  const dispatch = useDispatch();
  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: DATATABLE,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;
  const ActionOption = ({ id, name }) => (
    <div className="action_icon_wrapper">
      <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
        <Link to={`/appearance/view-page/${id}`} state={{ name: { name } }}>
          <Button className="btn btn-icon btn-primary" variant="">
            <i className="fe fe-eye"></i>
          </Button>
        </Link>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
        <Link to={`/appearance/edit-page/${id}`} state={{ name: { name } }}>
          <Button className="btn btn-icon btn-warning"
            variant=""
          >
            <i className="fe fe-edit"></i>
          </Button>
        </Link>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
        <Button
          className="btn btn-icon btn-danger"
          variant=""
          onClick={() =>
            alert(`Data with id ${id} is added to treash.`)
          }
        >
          <i className="fe fe-trash text-light"></i>
        </Button>
      </OverlayTrigger>
    </div >
  );
  return (
    <>
      <div className="e-table pb-5 table-responsive">
        <div className="d-block ms-5">
          <span>Show</span>
          <select
            className="m-5"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <span>Entries</span>
        </div>

        <Table {...getTableProps()} className="text-nowrap border-bottom">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={column.className}
                  >
                    <span className="tabletitle">
                      {column.render("Header")}
                    </span>
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-angle-down"></i>
                        ) : (
                          <i className="fa fa-angle-up"></i>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
                <th className="text-center wd-15p border-bottom-0">Action</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);

              return (
                <tr
                  className={`text-center ${rowIndex % 2 === 0 ? "odd_data_table_tr" : ""
                    }`}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="align-middle">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  <td>
                    <ActionOption id={row.original.ID} name={row.original.TITLE} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-block d-sm-flex mb-0 mx-4 mt-4  align-items-center">
          <span className="">
            <strong>
              Showing&nbsp;{pageIndex * pageSize + 1}&nbsp;To&nbsp;
              {Math.min((pageIndex + 1) * pageSize, DATATABLE.length)}
              &nbsp;Of&nbsp;
              {DATATABLE.length}&nbsp;Items
            </strong>
          </span>
          <span className="ms-sm-auto">
            <Button
              variant=""
              className="btn- d-sm-inline d-block me-2 my-2"
              onClick={() => gotoPage(pageIndex - 1)}
              disabled={!canPreviousPage}
            >
              <i className="fa fa-angle-left"></i>
              {" Previous "}
            </Button>
            {pageOptions.slice(pageIndex, pageIndex + 4).map((page, index) => (
              <Button
                variant=""
                className="btn-default tablebutton d-sm-inline d-block me-2 my-2"
                key={index}
                onClick={() => gotoPage(pageIndex + index)}
              >
                {pageIndex + index + 1}
              </Button>
            ))}
            <Button
              variant=""
              className="btn-none me-2 my-2"
              onClick={() => gotoPage(pageIndex + 1)}
              disabled={!canNextPage}
            >
              {" Next "}
              <i className="fa fa-angle-right"></i>
            </Button>
          </span>
        </div>
      </div>
    </>
  );
};

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span className="d-flex ms-auto d-inline-flex float-end">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control m-4"
        placeholder="Search..."
      />
    </span>
  );
};
