import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import ViewSaveForLater from "../components/saveforlater/ViewSaveForLater";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "customers",
    accessor: "customer",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Save For Later On",
    accessor: "saveForLatterOn",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
    className: "text-center wd-15p border-bottom-0 ",
  },
];

const ActionOption = ({ id, onShow }) => (
  <td className="action_icon_wrapper">
    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
      <Button className="btn btn-icon btn-primary" onClick={() => onShow(id)}>
        <i className="fe fe-eye"></i>
      </Button>
    </OverlayTrigger>
  </td>
);
export const DATATABLE = [
  {
    ID: "1",
    customer: "John Smith",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "2",
    customer: "Emily Johnson",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "3",
    customer: "Michael Brown",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 2,
  },
  {
    ID: "4",
    customer: "Sarah Davis",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "5",
    customer: "Christopher Wilson",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 2,
  },
  {
    ID: "6",
    customer: "Jennifer Martinez",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 3,
  },
  {
    ID: "7",
    customer: "David Anderson",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 2,
  },
  {
    ID: "8",
    customer: "Jessica Taylor",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "9",
    customer: "James Thomas",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "10",
    customer: "Ashley Garcia",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "11",
    customer: "Robert Jackson",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 3,
  },
  {
    ID: "12",
    customer: "Amanda White",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 2,
  },
  {
    ID: "13",
    customer: "William Lee",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 2,
  },
  {
    ID: "14",
    customer: "Stephanie Harris",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
  {
    ID: "15",
    customer: "Daniel Rodriguez",
    saveForLatterOn: "Jan 24, 2024",
    quantity: 1,
  },
];

export const SaveForLaterData = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleShowModal = (product_id) => {
    setShowModal(true);
    setSelectedProductId(product_id);
  };

  const handleModalClose = () => {
    console.log("Deleting product with ID:", selectedProductId);
    setShowModal(false);
  };

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

  return (
    <>
      <ViewSaveForLater
        show={showModal}
        hide={handleModalClose}
        saveLaterID={selectedProductId}
      />

      <div className="e-table pb-5 table-responsive">
        <div className="d-block ms-5">
          <span>Show </span>
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
                  className={`text-center ${
                    rowIndex % 2 === 0 ? "odd_data_table_tr" : ""
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
                  <ActionOption id={row.original.ID} onShow={handleShowModal} />
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
