import React, { Fragment, useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";

import {
  lighten,
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import {
  useExpanded,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";

import { TableProps } from "../Utils/Models/table";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},

    highlight: {
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },

    title: {
      // flex: '1 1 100%',
      // display: "flex",
      // alignItems: "center",
    },
    // bodyRow: {
    //   "&:hover": {
    //     cursor: "pointer",
    //   },
    // },
    bodyRow: {
      "&:hover": {
        cursor: (props: any) =>
          props.hasRowClickedFeature ||
          (!props.notExpandWithRowClick && props.renderRowSubComponent)
            ? "pointer"
            : "default",
      },
    },
    bodyRowNormal: {},
    tableHeadColor: {
      backgroundColor: (props: any) => props.tableHeadColor,
    },
    tableContainerBorder: {
      border: (props: any) =>
        "1px solid " +
        (props.tableContainerColor
          ? props.tableContainerColor
          : theme.palette.divider),
    },
  })
);
const defaultColumn = {};
const ReactTableMUI = ({
  columns,
  data,
  TableToolbar,
  onSelectedAll,
  onRowsSelected,
  onChangePage,
  onChangeRowsPerPage,
  totalDataNumber,
  textRowSelected = "Selected",
  textBodyEmpty = "Empty",
  numberSelected,
  selectAll,
  onSorted,
  onRowClicked,
  hasRowClickedFeature,
  disableCheckBox,
  manualPagination,
  manualSortBy,
  defaultPageSize = 5,
  renderRowSubComponent,
  manualPage,
  manualPageSize,
  notExpandWithRowClick,
  hideHeader,
  hideFooter,
  tableHeadColor,
  tableContainerColor,
  onContextMenu,
  stickyHeader,
  manualOrderById,
  manualDescendingSort
}: TableProps) => {
  const classes = useStyles({
    tableHeadColor,
    renderRowSubComponent,
    tableContainerColor,
    hasRowClickedFeature,
    notExpandWithRowClick,
  });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter, expanded },
    isAllRowsSelected,
    toggleAllRowsSelected,
    selectedFlatRows,
    setHiddenColumns,
    visibleColumns,
    toggleRowExpanded,
  }: any = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { hiddenColumns: ["id"], pageSize: defaultPageSize,sortBy: manualSortBy ? [{ id: manualOrderById, desc: manualDescendingSort }] : [] },
      autoResetPage: false,
      manualPagination: manualPagination,
      pageCount: totalDataNumber,
      autoResetSelectedRows: true,
      manualSortBy: manualSortBy,
      autoResetSortBy: false,
      disableSortBy: false,
      autoResetExpanded: true,
    } as any,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks: any) =>
      disableCheckBox
        ? { hooks }
        : hooks.allColumns.push((columns: any) => [
            // Let's make a column for selection
            {
              id: "selection",
              Header: ({ getToggleAllRowsSelectedProps }: any) => {
                return (
                  <div>
                    <Checkbox
                      {...getToggleAllRowsSelectedProps()}
                      onChange={(event: any) => {
                        getToggleAllRowsSelectedProps().onChange(event);
                        onSelectedAll && onSelectedAll(event.target.checked);
                      }}
                    />
                  </div>
                );
              },
              // The cell can use the individual row's getToggleRowSelectedProps method
              // to the render a checkbox
              Cell: ({ row }: any) => {
                return (
                  <div>
                    <Checkbox
                      {...row.getToggleRowSelectedProps()}
                      onChange={(event: any) => {
                        row.getToggleRowSelectedProps().onChange(event);
                        onRowsSelected &&
                          onRowsSelected(row.original, event.target.checked); //selectedFlatRows)
                      }}
                      onClick={(
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        //this is to prevent the row onClick event executed after the checkbox is clicked
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                    />
                  </div>
                );
              },
            },
            ...columns,
          ])
  );

  useEffect(() => {
    setHiddenColumns(
      columns
        .filter((column: any) => column.hideColumn)
        .map((column: any) => column.accessor)
    );
  }, [setHiddenColumns, columns]);

  useEffect(() => {
    toggleAllRowsSelected(selectAll);
  }, [selectAll, data]);

  const handleChangePage = (event: any, newPage: any) => {
    onChangePage && onChangePage(event, newPage, pageSize);
    gotoPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const pageSizeBefore = pageSize;
    onChangeRowsPerPage &&
      onChangeRowsPerPage(event.target.value, pageIndex, pageSizeBefore);
    setPageSize(Number(event.target.value));
  };
  // Render the UI for your table
  return (
    <>
      <TableContainer classes={{ root: classes.tableContainerBorder }} style={stickyHeader ? { maxHeight: 250 } : {}}>
        {TableToolbar ? TableToolbar : null}
        <Table stickyHeader={stickyHeader} size={"small"} {...getTableProps()}>
          {hideHeader ? null : (
            <TableHead classes={{ root: classes.tableHeadColor }}>
              {headerGroups.map((headerGroup: any, index: number) => (
                <TableRow
                  key={index + "TableRow_Header"}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column: any, index2: number) => {
                    return (
                      <TableCell
                        style={{ width: "120px" }}
                        key={index2 + "TableCell_Header"}
                        {...(column.id === "selection"
                          ? column.getHeaderProps()
                          : column.getHeaderProps(
                              column.getSortByToggleProps()
                            ))}
                      >
                        {column.id !== "selection" ? (
                          column.canSort ? (
                            <TableSortLabel
                              active={column.isSorted}
                              hideSortIcon={false}
                              direction={column.isSortedDesc ? "desc" : "asc"}
                              onClick={(
                                event: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ) => {
                                if (!manualSortBy) {
                                  gotoPage(0);
                                }
                                if (column.isSortedDesc) {
                                  onSorted && onSorted("", "", pageSize); //column.id
                                } else if (column.isSortedDesc === false) {
                                  onSorted &&
                                    onSorted(column.id, "desc", pageSize);
                                } else {
                                  onSorted &&
                                    onSorted(column.id, "asc", pageSize);
                                }
                              }}
                            >
                              {column.render("Header")}
                            </TableSortLabel>
                          ) : (
                            column.render("Header")
                          )
                        ) : (
                          column.render("Header")
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
          )}
          <TableBody {...getTableBodyProps()}>
            {!numberSelected ? null : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  size={"small"}
                  // className={clsx({
                  //   [classes.highlight]: numberSelected ? true : false,
                  // })}
                >
                  {numberSelected ? (
                    <Typography color="textPrimary" variant="body2">
                      {textRowSelected + ": " + numberSelected}
                    </Typography>
                  ) : (
                    <Typography color="textPrimary" variant="body2">
                      {textRowSelected + ": 0"}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
            {totalDataNumber ? null : (
              <TableRow>
                <TableCell
                  style={{ border: "none" }}
                  colSpan={visibleColumns.length}
                >
                  <Typography
                    color="textPrimary"
                    variant="caption"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {textBodyEmpty}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {page.map((row: any, index: number) => {
              prepareRow(row);
              return (
                <Fragment key={index + "Fragment"}>
                  <TableRow
                    hover={true}
                    selected={row.original.isSelected}
                    {...row.getRowProps()}
                    onClick={(event: any) => {
                      hasRowClickedFeature &&
                        onRowClicked &&
                        onRowClicked(row.original, event);
                      !notExpandWithRowClick &&
                        renderRowSubComponent &&
                        toggleRowExpanded(row.id);
                    }}
                    onContextMenu={(event: any) => {
                      event.preventDefault();
                      onContextMenu && onContextMenu(row.original, event);
                    }}
                    className={classes.bodyRow}
                    // className={clsx(classes.bodyRowNormal, {
                    //   [classes.bodyRow]:
                    //     hasRowClickedFeature || (!notExpandWithRowClick && renderRowSubComponent),
                    // })}
                  >
                    {row.cells.map((cell: any, index2: number) => {
                      return (
                        <TableCell
                          key={index2 + "TableCell"}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {row.isExpanded ? (
                    <TableRow
                      // hover={true}
                      selected={row.original.isSelected}
                      key={index + "TableRowExpanded"}
                    >
                      <TableCell
                        padding={"none"}
                        colSpan={visibleColumns.length}
                      >
                        {/*
                        Inside it, call our renderRowSubComponent function. In reality,
                        you could pass whatever you want as props to
                        a component like this, including the entire
                        table instance. But for this example, we'll just
                        pass the row
                      */}

                        {renderRowSubComponent &&
                          renderRowSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {hideFooter ? null : (
        <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
          <Pagination
            color="primary"
            count={Math.ceil(totalDataNumber / pageSize)}
            defaultPage={manualPage ? (manualPage as number) : undefined}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </>
  );
};

export default ReactTableMUI;
