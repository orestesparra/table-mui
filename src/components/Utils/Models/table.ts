import { Component } from "react";

export interface TableProps {
  columns: any; //https://react-table.tanstack.com/docs/api/useTable#column-properties
  data: any;
  TableToolbar?: any;
  onSelectedAll?: (selectAll: boolean) => void;
  onRowsSelected?: (row: any, checked: boolean) => void;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number, pageSize: number) => void;
  onChangeRowsPerPage: (
    number: number,
    pageIndex: number,
    pageSizeBefore: number
  ) => void;
  totalDataNumber: number;
  textRowSelected?: string;
  textBodyEmpty?: string;
  numberSelected?: number;
  selectAll?: boolean;
  onSorted?: (id: string, direction: string, pageSize: number) => void;
  onRowClicked?: (row: any, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hasRowClickedFeature?: boolean;
  disableCheckBox?: boolean;
  manualPagination?: boolean;
  manualSortBy?: boolean;
  defaultPageSize?: number;
  renderRowSubComponent?: any;
  notExpandWithRowClick?: boolean;
  manualPage?: number;
  manualPageSize?: number;
  hideHeader?: boolean;
  hideFooter?: boolean;
  tableHeadColor?: string;
  tableContainerColor?: string;
  onContextMenu?: (row: any, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  stickyHeader?: boolean
  manualOrderById?: string
  manualDescendingSort?:boolean
}
