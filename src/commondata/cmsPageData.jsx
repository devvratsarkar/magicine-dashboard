import React, { useState } from "react";
import {
  Button,
  OverlayTrigger,
  Table,
  Tooltip,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";
import inventoryImage from "../assets/images/dashboard/inventory.png";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Page Type",
    accessor: "PAGETYPE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Page Title",
    accessor: "PAGETITLE",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Created On",
    accessor: "CREATEDON",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

export const DATATABLE = [
  {
    ID: "1",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "2",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "3",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "4",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "5",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "6",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "7",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "8",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "9",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "10",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "11",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "12",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "13",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "14",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
  {
    ID: "15",
    IMAGE: inventoryImage,
    PAGETYPE: "Mama Earth cleanser",
    PAGETITLE: "Mama Earth",
    CREATEDON: "April 4, 2024 at 6:15 PM",
  },
];
export const CMSPagesDataTable = () => {
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

  const ActionOption = ({ id }) => (
    <div className="action_icon_wrapper" >
      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
        <Link to={`#`} >
          <Button className="btn btn-icon btn-warning" variant="">
            <i className="fe fe-edit"></i>
          </Button>
        </Link>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
        <Button
          className="btn btn-icon btn-danger"
          variant=""
          onClick={() =>
            alert(`Data with id ${id} is added to trash.`)
          }
        >
          <i className="fe fe-trash text-light"></i>
        </Button>
      </OverlayTrigger>
    </div>
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
          <span>Entrie</span>
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
                    <ActionOption id={row.original.ID} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-block d-sm-flex m-4 ">
          <span className="">
            <strong>
              Showing&nbsp;{pageIndex * pageSize + 1}&nbsp;to&nbsp;
              {Math.min((pageIndex + 1) * pageSize, DATATABLE.length)}
              &nbsp;of&nbsp;
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