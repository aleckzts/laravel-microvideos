import React from 'react';
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from 'mui-datatables';
import { merge, omit, cloneDeep } from 'lodash';
import { MuiThemeProvider, useTheme } from '@material-ui/core';

const defaultOptions: MUIDataTableOptions = {
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
};

export interface TableColumn extends MUIDataTableColumn {
  width?: string;
}

interface TableProps extends MUIDataTableProps {
  columns: TableColumn[];
  loading?: boolean;
}

const Table: React.FC<TableProps> = ({ columns, loading, ...props }) => {
  const theme = cloneDeep(useTheme());

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

  const newProps = merge(
    { options: defaultOptions },
    props,
    {
      columns: extractMuiDataTableColumns(columns),
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

  // applyLoading();

  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable {...newProps} />
    </MuiThemeProvider>
  );
};

export default Table;
