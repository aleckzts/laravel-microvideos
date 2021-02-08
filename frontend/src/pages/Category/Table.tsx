import React, { useEffect, useReducer, useState } from 'react';
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
import reducer, { Creators, INITIAL_STATE } from '../../store/search';

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
  const [data, setData] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [totalRecords, setTotalRecords] = useState(0);

  function cleanSearchText(text: any): string {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  useEffect(() => {
    let isCancelled = false;

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await CategoryApi.list({
          queryParams: {
            search: cleanSearchText(searchState.search),
            page: searchState.pagination.page,
            per_page: searchState.pagination.per_page,
            sort: searchState.order.sort,
            dir: searchState.order.dir,
          },
        });
        if (!isCancelled) {
          setData(response.data.data);
          setTotalRecords(response.data.meta.total);
          // setSearchState(prevState => ({
          //   ...prevState,
          //   pagination: {
          //     ...prevState.pagination,
          //     total: response.data.meta.total,
          //   },
          // }));
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
      isCancelled = true;
    };
  }, [
    searchState.search,
    searchState.pagination.page,
    searchState.pagination.per_page,
    searchState.order,
    snackbar,
  ]);

  return (
    <Table
      title="Listagem de Categorias"
      columns={columsDefinition}
      data={data}
      loading={loading}
      options={{
        serverSide: true,
        searchText: searchState.search as string,
        page: searchState.pagination.page - 1,
        rowsPerPage: searchState.pagination.per_page,
        count: totalRecords,
        customToolbar: () => (
          <FilterResetButton
            handleClick={() => dispatch(Creators.setReset())}
          />
        ),
        onSearchChange: value =>
          dispatch(Creators.setSearch({ search: value as string })),
        onChangePage: page => dispatch(Creators.setPage({ page: page + 1 })),
        onChangeRowsPerPage: perPage =>
          dispatch(Creators.setPerPage({ per_page: perPage })),
        onColumnSortChange: (changedColumn: string, direction: string) =>
          dispatch(
            Creators.setOrder({
              sort: changedColumn,
              dir: direction.includes('desc') ? 'desc' : 'asc',
            }),
          ),
      }}
    />
  );
};

export default CategoryTable;
