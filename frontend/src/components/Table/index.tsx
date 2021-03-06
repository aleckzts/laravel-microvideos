import React, { RefAttributes } from 'react';
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from 'mui-datatables';
import { merge, omit, cloneDeep } from 'lodash';
import { MuiThemeProvider, useMediaQuery, useTheme } from '@material-ui/core';

import DebounceTableSearch from './DebounceTableSearch.js';

const makeDefaultOption = (debounceWait?: number): MUIDataTableOptions => ({
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: 'Nenhum registro encontrado',
      toolTip: 'Classificar',
    },
    pagination: {
      next: 'Próxima página',
      previous: 'Página anterior',
      rowsPerPage: 'Por página:',
      displayRows: 'de',
    },
    toolbar: {
      search: 'Busca',
      downloadCsv: 'Download CSV',
      print: 'Imprimir',
      viewColumns: 'Ver colunas',
      filterTable: 'Filtrar tabelas',
    },
    filter: {
      all: 'Todos',
      title: 'Filtros',
      reset: 'Limpar',
    },
    viewColumns: {
      title: 'Ver colunas',
      titleAria: 'Ver/Esconder coluna',
    },
    selectedRows: {
      text: 'Registro(s) selecionados',
      delete: 'Excluir',
      deleteAria: 'Excluir registros selecionados',
    },
  },
  // customSearchRender: debounce(
  //   (searchText: string, handleSearch: any, hideSearch: any, options: any) => {
  //     return (
  //       <DebounceTableSearch
  //         searchText={searchText}
  //         onSearch={handleSearch}
  //         onHide={hideSearch}
  //         options={options}
  //       />
  //     );
  //   },
  //   300,
  // ),
  customSearchRender: (
    searchText: string,
    handleSearch: any,
    hideSearch: any,
    options: any,
  ) => {
    return (
      <DebounceTableSearch
        searchText={searchText}
        onSearch={handleSearch}
        onHide={hideSearch}
        options={options}
        debounceWait={debounceWait}
      />
    );
  },
  // customSearchRender: DebounceSearchRender(500),
});

export interface TableComponent {
  changePage: (page: number) => void;
  changeRowsPerPage: (rowsPerPage: number) => void;
}

export interface TableColumn extends MUIDataTableColumn {
  width?: string;
  padding?: string;
}

interface TableProps extends MUIDataTableProps, RefAttributes<TableComponent> {
  columns: TableColumn[];
  loading?: boolean;
  debounceWait?: number;
}

const Table = React.forwardRef<TableComponent, TableProps>(
  ({ columns, loading, debounceWait, ...props }, ref) => {
    const theme = cloneDeep(useTheme());
    const isSMOrDown = useMediaQuery(theme.breakpoints.down('sm'));

    function setColumnsWidth(columnsWidth: TableColumn[]): void {
      columnsWidth.forEach((column, key) => {
        if (column.width) {
          const overrides = theme.overrides as any;
          overrides.MUIDataTableHeadCell.fixedHeader[
            `&:nth-child(${key + 2})`
          ] = {
            width: column.width,
          };
        }

        if (column.padding) {
          const overrides = theme.overrides as any;
          overrides.MUIDataTableBodyCell.root[`&:nth-child(${key + 2})`] = {
            padding: column.padding,
          };
        }
      });
    }

    function extractMuiDataTableColumns(extractColumns: TableColumn[]): any {
      setColumnsWidth(columns);
      return extractColumns.map(column => omit(column, 'width'));
    }
    // function applyLoading(): void {
    //   // if (props.options) {
    //   const textLables = (props.options as any).textLabels;
    //   textLables.body.noMatch = loading
    //     ? 'Carregando...'
    //     : textLables.body.noMatch;
    //   // }
    // }

    const defaultOptions = makeDefaultOption(debounceWait);

    const newProps = merge(
      { options: defaultOptions },
      props,
      {
        columns: extractMuiDataTableColumns(columns),
      },
      {
        options: {
          responsive: isSMOrDown ? 'simple' : 'vertical',
        },
      },
      {
        options: {
          textLabels: {
            body: {
              noMatch: loading ? 'Carregando' : 'Nenhum registro encontrado',
            },
          },
        },
      },
    );

    // function applyResponsive(): void {
    //   newProps.options.responsive = isSMorDown ? 'simple' : 'd';
    // }

    // applyLoading();
    // applyResponsive();

    return (
      <MuiThemeProvider theme={theme}>
        <MUIDataTable
          {...newProps}
          // @ts-ignore
          ref={ref}
        />
      </MuiThemeProvider>
    );
  },
);

export default Table;
