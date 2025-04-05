import React, { useState } from "react";
import { Dropdown, Pagination, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { mailInboxdata, mailHeader } from "../../commondata/mailData";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import MailComponent from "./mail_option_component/MailComponent";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

export default function MailSent() {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const newSelectedItems = selectAll
      ? []
      : mailInboxdata.map((_, index) => index);
    setSelectedItems(newSelectedItems);
  };

  const toggleSelectItem = (index) => {
    const selectedIndex = selectedItems.indexOf(index);
    let newSelectedItems = [...selectedItems];
    if (selectedIndex === -1) {
      newSelectedItems.push(index);
    } else {
      newSelectedItems.splice(selectedIndex, 1);
    }
    setSelectedItems(newSelectedItems);
  };

  const tableInstance = useTable(
    {
      columns: mailHeader,
      data: mailInboxdata,
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
    <div>
      <PageHeader
        titles="Mail Inbox"
        active="Message Sent"
        items={["Home"]}
        links={["/dashboard"]}
      />
      <Row>
        <Col lg={4} xl={3} md={12}>
          <MailComponent />
        </Col>
        <Col md={12} lg={8} xl={9}>
          <Card>
            <Card.Header>
              <h3 className="card-title text-muted">Sent Items</h3>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="d-block ms-5">
                <span>Show</span>
                <select
                  className="m-5 border border-muted rounded-md"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <GlobalFilter
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
                <span>Entries</span>
              </div>
              <div className="inbox-body">
                <div className="mail-option px-6">
                  <div className="btn-group me-1">
                    <Link to="#" className="btn mini tooltips">
                      <i className=" fa fa-refresh"></i>
                    </Link>
                  </div>
                  <div className="chk-all me-1">
                    {selectedItems.length === 0 ? null : (
                      <Dropdown>
                        <Dropdown.Toggle
                          to="#"
                          className="btn mini all fa fa-angle-down fs-5 text-muted"
                          variant=""
                          aria-expanded="false"
                        ></Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item>
                            <i className="fa fa-exclamation"></i> Movie To Spam
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <i className="fa fa-trash"></i> Movie To Trash
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </div>
                <div className="table-responsive">
                  <Table
                    {...getTableProps()}
                    className="text-nowrap border-bottom"
                  >
                    <thead>
                      <tr>
                        <th>
                          <label className="custom-control custom-checkbox mb-0 text-center">
                            <input
                              type="checkbox"
                              className=""
                              name=""
                              value=""
                              checked={selectAll}
                              onChange={toggleSelectAll}
                            />
                          </label>
                        </th>
                        {headerGroups.map((headerGroup) =>
                          headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
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
                          ))
                        )}
                      </tr>
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
                            <td>
                              <label className="custom-control custom-checkbox mb-0">
                                <input
                                  type="checkbox"
                                  className=""
                                  name=""
                                  value=""
                                  checked={selectedItems.includes(rowIndex)}
                                  onChange={() => toggleSelectItem(rowIndex)}
                                />
                              </label>
                            </td>

                            {/* Table cells */}
                            {row.cells.map((cell) => (
                              <td
                                {...cell.getCellProps()}
                                className="align-middle"
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <div className="d-block d-sm-flex mb-0 mt-4 mx-4 ">
                    <span className="">
                      <strong>
                        Showing&nbsp;{pageIndex * pageSize + 1}&nbsp;To&nbsp;
                        {Math.min(
                          (pageIndex + 1) * pageSize,
                          mailInboxdata.length
                        )}
                        &nbsp;Of&nbsp;
                        {mailInboxdata.length}&nbsp;Items
                      </strong>
                    </span>
                    {/* ----------------------------------------------------------- */}
                    <span className="ms-sm-auto">
                      <Button
                        variant=""
                        className="btn-default tablebutton d-sm-inline d-block me-2 my-2"
                        onClick={() => gotoPage(pageIndex - 1)}
                        disabled={!canPreviousPage}
                      >
                        {" Previous "}
                      </Button>
                      {pageOptions
                        .slice(pageIndex, pageIndex + 4)
                        .map((page, index) => (
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
                        className="btn-default tablebutton me-2 my-2"
                        onClick={() => gotoPage(pageIndex + 1)}
                        disabled={!canNextPage}
                      >
                        {" Next "}
                      </Button>
                    </span>
                    {/* ------------------------------------------------------- */}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

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
