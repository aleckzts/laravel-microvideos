import React, { useEffect, useRef, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import { BadgeNo, BadgeYes } from '../../components/Navbar/Badge';

import Table, { TableColumn, TableComponent } from '../../components/Table';
import { GenreType } from './Form';
import GenreApi from '../../services/GenreApi';
import useFilter from '../../hooks/useFilter';
import FilterResetButton from '../../components/Table/FilterResetButton';
import Yup from '../../yupBR';

type categoryInterface = {
  name: string;
};

const columnsDefinition: TableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    width: '30%',
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: 'name',
    label: 'Nome',
    width: '23%',
    options: {
      filter: false,
    },
  },
  {
    name: 'categories',
    label: 'Categorias',
    width: '20%',
    options: {
      customBodyRender(value: unknown) {
        const categories = value as Array<categoryInterface>;
        return (
          <span>{categories.map(category => category.name).join(', ')}</span>
        );
      },
    },
  },
  {
    name: 'is_active',
    label: 'Ativo',
    width: '4%',
    options: {
      filterOptions: {
        names: ['Sim', 'Não'],
      },
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
      filter: false,
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
      filter: false,
      customBodyRender(_, tableMeta) {
        return (
          <IconButton
            color="secondary"
            component={Link}
            to={`/genres/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        );
      },
    },
  },
];

const GenreTable: React.FC = () => {
  const snackbar = useSnackbar();
  const isCancelled = useRef(false);
  const [data, setData] = useState<GenreType[]>([]);
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
    columns: columnsDefinition,
    debounceWait: debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return Yup.object().shape({
          categories: Yup.mixed()
            .nullable()
            .transform(value => {
              return !value || value === '' ? undefined : value.split(',');
            })
            .default(null),
        });
      },
      formatSearchParams: debouncedState => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.categories && {
                categories: debouncedState.extraFilter.categories.join(','),
              }),
            }
          : undefined;
      },
      getStateFromURL: queryParams => {
        return {
          categories: queryParams.get('categories'),
        };
      },
    },
  });

  useEffect(() => {
    isCancelled.current = false;
    filterManager.pushHistory();

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await GenreApi.list({
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
        if (GenreApi.isRequestCancelled(err)) {
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
      title="Listagem de Gêneros"
      columns={columnsDefinition}
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

export default GenreTable;
