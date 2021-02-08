import React, { useEffect, useRef, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import { BadgeNo, BadgeYes } from '../../components/Navbar/Badge';

import Table, { TableColumn } from '../../components/Table';
import { CategoryType } from './Form';
import CategoryApi from '../../services/CategoryApi';
import FilterResetButton from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';

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
    width: '43%',
  },
  {
    name: 'is_active',
    label: 'Ativo',
    width: '4%',
    options: {
      customBodyRender(value) {
        return value ? <BadgeYes /> : <BadgeNo />;
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
            to={`/categories/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        );
      },
    },
  },
];

const CategoryTable: React.FC = () => {
  const snackbar = useSnackbar();
  const isCancelled = useRef(false);
  const [data, setData] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTime = 300;
  const rowsPerPage = 15;
  const rowsPerPageOptions = [15, 25, 50];

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
  });

  useEffect(() => {
    isCancelled.current = false;
    filterManager.pushHistory();

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await CategoryApi.list({
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
        if (CategoryApi.isRequestCancelled(err)) {
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
      title="Listagem de Categorias"
      columns={columsDefinition}
      data={data}
      loading={loading}
      debounceWait={debounceTime}
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

export default CategoryTable;
