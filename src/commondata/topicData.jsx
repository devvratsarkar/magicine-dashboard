import React, { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Link } from "react-router-dom";
import DEleteTopics from "../components/appearance/FAQ/DeleteTopic";
import EditTopic from "../components/appearance/FAQ/EditTopic";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";

export const COLUMNS = [
  {
    Header: "#",
    accessor: "ID",
    className: "text-center wd-15p border-bottom-0",
  },
  {
    Header: "Topic",
    accessor: "TOPIC",
    className: "text-center wd-15p border-bottom-0 ",
  },
  {
    Header: "FAQ For",
    accessor: "FAQFOR",
    className: "text-center wd-15p border-bottom-0",
  },
];

export const DATATABLE = [
  {
    ID: "1",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "2",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "3",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "4",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "5",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "6",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "7",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "8",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "9",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "10",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "11",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "12",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "13",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "14",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
  {
    ID: "15",
    TOPIC: "Buying Proccess",
    FAQFOR: "Customer",
  },
];

export const TopicData = () => {
  const dispatch = useDispatch();
  const [selectFAQID, setSelectFAQID] = useState(null);

  const [selectTopicID, setSelectTopicID] = useState(null);

  const handleDeleteTopicOpen = (topic_id) => {
    setTopicDataDeleteOpen(true);
    setSelectTopicID(topic_id);
  };
  const handleDeleteTopicClose = () => {
    setTopicDataDeleteOpen(false);
  };
  const [topicDataEditOpen, setTopicDataEditOpen] = useState(false);
  const handleEditDataOpen = (topic_id) => {
    setTopicDataEditOpen(true);
    setSelectTopicID(topic_id);
  };

  const handleEditDataClose = () => {
    setTopicDataEditOpen(false);
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
  const ActionOption = ({ id, onDelete, onEdit }) => (
    <div className="action_icon_wrapper">
      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
        <Button onClick={() => onEdit(id)} className="btn btn-icon btn-warning" variant="">
          <i className="fe fe-edit"></i>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
        <Button
          className="btn btn-icon btn-danger" variant=""
          onClick={() =>
            alert( `Data with id ${id} is added to trash.`)
          }
        >
          <i className="fe fe-trash text-light"></i>
        </Button>
      </OverlayTrigger>
    </div>
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
      <EditTopic
        show={topicDataEditOpen}
        hide={handleEditDataClose}
        TopicID={selectTopicID}
      />
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
                    <span className="tableNAME">{column.render("Header")}</span>
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
                    <ActionOption
                      id={row.original.ID}
                      onDelete={handleDeleteTopicOpen}
                      onEdit={handleEditDataOpen}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="d-block d-sm-flex mb-0 mt-4 mx-4 align-items-center ">
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
