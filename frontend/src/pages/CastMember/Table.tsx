import React, { useEffect, useRef, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { Chip, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

import { useSnackbar } from 'notistack';
import Table, { TableColumn, TableComponent } from '../../components/Table';
import { CastMemberType } from './Form';
import CastMemberApi from '../../services/CastMemberApi';
import useFilter from '../../hooks/useFilter';
import FilterResetButton from '../../components/Table/FilterResetButton';

type castMemberTypeInterface = {
  [key: string]: string;
};

const castMemberType: castMemberTypeInterface = {
  '1': 'Diretor',
  '2': 'Ator',
};

const columsDefinition: TableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    width: '30%',
    options: {
      sort: false,
    },
  },
  {
    name: 'name',
    label: 'Nome',
    width: '33%',
  },
  {
    name: 'type',
    label: 'Tipo',
    width: '10%',
    options: {
      customBodyRender(value) {
        return <Chip label={castMemberType[value]} color="primary" />;
      },
    },
  },
  {
    name: 'created_at',
    label: 'Criado em',
    width: '10%',
    options: {
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    width: '13%',
    padding: '0 16px',
    options: {
      sort: false,
      customBodyRender(_, tableMeta) {
        return (
          <IconButton
            color="secondary"
            component={Link}
            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        );
      },
    },
  },
];

const CastMemberTable: React.FC = () => {
  const snackbar = useSnackbar();
  const isCancelled = useRef(false);
  const [data, setData] = useState<CastMemberType[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTime = 300;
  const rowsPerPage = 15;
  const rowsPerPageOptions = [15, 25, 50];
  const tableRef = useRef() as React.MutableRefObject<TableComponent>;

  const {
    filterManager,
    debouncedFilterState,
    filterState,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columsDefinition,
    debounceWait: debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef,
  });

  useEffect(() => {
    isCancelled.current = false;
    filterManager.pushHistory();

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await CastMemberApi.list({
          queryParams: {
            search: filterManager.cleanSearchText(filterState.search),
            page: filterState.pagination.page,
            per_page: filterState.pagination.per_page,
            sort: filterState.order.sort,
            dir: filterState.order.dir,
          },
        });
        if (!isCancelled.current) {
          setData(response.data.data);
          setTotalRecords(response.data.meta.total);
        }
      } catch (err) {
        console.log(err);
        if (CastMemberApi.isRequestCancelled(err)) {
          return;
        }
        snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    getData();
    return () => {
      isCancelled.current = true;
    };
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    // getData,
  ]);

  return (
    <Table
      title="Listagem de Membros de Elenco"
      columns={columsDefinition}
      data={data}
      loading={loading}
      debounceWait={debounceTime}
      ref={tableRef}
      options={{
        serverSide: true,
        searchText: filterState.search as string,
        page: filterState.pagination.page - 1,
        rowsPerPage: filterState.pagination.per_page,
        rowsPerPageOptions,
        count: totalRecords,
        customToolbar: () => (
          <FilterResetButton handleClick={() => filterManager.resetFilter()} />
        ),
        onSearchChange: value => filterManager.ChangeSearch(value as string),
        onChangePage: page => filterManager.ChangePage(page),
        onChangeRowsPerPage: perPage =>
          filterManager.ChangeRowsPerPage(perPage),
        onColumnSortChange: (changedColumn: string, direction: string) =>
          filterManager.ChangeColumnSort(changedColumn, direction),
      }}
    />
  );
};

export default CastMemberTable;
