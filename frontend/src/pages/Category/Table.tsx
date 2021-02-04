import React, { useEffect, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { BadgeNo, BadgeYes } from '../../components/Navbar/Badge';

import Table, { TableColumn } from '../../components/Table';
import { CategoryType } from './Form';
import CategoryApi from '../../services/CategoryApi';

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

interface PaginationType {
  page: number;
  total: number;
  per_page: number;
}

interface OrderType {
  sort: string | null;
  dir: string | null;
}

interface SearchStateType {
  search: string;
  pagination: PaginationType;
  order: OrderType;
}

const CategoryTable: React.FC = () => {
  const [data, setData] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<SearchStateType>({
    search: '',
    pagination: {
      page: 1,
      total: 0,
      per_page: 10,
    },
    order: {
      sort: null,
      dir: null,
    },
  });

  useEffect(() => {
    let isCancelled = false;

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await CategoryApi.list({
          queryParams: {
            search: searchState.search,
            page: searchState.pagination.page,
            per_page: searchState.pagination.per_page,
            sort: searchState.order.sort,
            dir: searchState.order.dir,
          },
        });
        if (!isCancelled) {
          setData(response.data.data);
          setSearchState(prevState => ({
            ...prevState,
            pagination: {
              ...prevState.pagination,
              total: response.data.meta.total,
            },
          }));
        }
      } catch (err) {
        console.log(err);
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
  ]);

  return (
    <Table
      title="Listagem de Categorias"
      columns={columsDefinition}
      data={data}
      loading={loading}
      options={{
        serverSide: true,
        searchText: searchState.search,
        page: searchState.pagination.page - 1,
        rowsPerPage: searchState.pagination.per_page,
        count: searchState.pagination.total,
        onSearchChange: value =>
          value && setSearchState({ ...searchState, search: value }),
        onChangePage: page =>
          setSearchState({
            ...searchState,
            pagination: { ...searchState.pagination, page: page + 1 },
          }),
        onChangeRowsPerPage: perPage =>
          setSearchState({
            ...searchState,
            pagination: { ...searchState.pagination, per_page: perPage + 1 },
          }),
        onColumnSortChange: (changedColumn: string, direction: string) =>
          setSearchState({
            ...searchState,
            order: {
              sort: changedColumn,
              dir: direction.includes('desc') ? 'desc' : 'asc',
            },
          }),
      }}
    />
  );
};

export default CategoryTable;
