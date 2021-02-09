import React, { useEffect, useRef, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { Chip, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

import { useSnackbar } from 'notistack';
import { invert } from 'lodash';
import Table, { TableColumn, TableComponent } from '../../components/Table';
import { CastMemberType } from './Form';
import CastMemberApi from '../../services/CastMemberApi';
import useFilter from '../../hooks/useFilter';
import FilterResetButton from '../../components/Table/FilterResetButton';
import Yup from '../../yupBR';

type castMemberTypeInterface = {
  [key: string]: string;
};

const castMemberType: castMemberTypeInterface = {
  '1': 'Diretor',
  '2': 'Ator',
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
    width: '33%',
    options: {
      filter: false,
    },
  },
  {
    name: 'type',
    label: 'Tipo',
    width: '10%',
    options: {
      filterOptions: {
        names: Object.values(castMemberType),
      },
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
    columns,
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
          type: Yup.string()
            .nullable()
            .transform(value => {
              return !value || !Object.values(castMemberType).includes(value)
                ? undefined
                : value;
            })
            .default(null),
        });
      },
      formatSearchParams: debouncedState => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.type && {
                type: debouncedState.extraFilter.type,
              }),
            }
          : undefined;
      },
      getStateFromURL: queryParams => {
        return {
          type: queryParams.get('type'),
        };
      },
    },
  });

  const indexColumnType = columns.findIndex(c => c.name === 'type');
  const columnType = columns[indexColumnType];
  const typeFilterValue =
    filterState.extraFilter && (filterState.extraFilter.type as never);
  (columnType.options as any).filterList = typeFilterValue
    ? [typeFilterValue]
    : [];

  const serverSideFilterList = columns.map(column => []);
  if (typeFilterValue) {
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }

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
            ...(filterState.extraFilter &&
              filterState.extraFilter.type && {
                type: invert(castMemberType)[filterState.extraFilter.type],
              }),
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
    JSON.stringify(debouncedFilterState.extraFilter),
    // getData,
  ]);

  return (
    <Table
      title="Listagem de Membros de Elenco"
      columns={columnsDefinition}
      data={data}
      loading={loading}
      debounceWait={debounceTime}
      ref={tableRef}
      options={{
        // serverSideFilterList,
        serverSide: true,
        searchText: filterState.search as string,
        page: filterState.pagination.page - 1,
        rowsPerPage: filterState.pagination.per_page,
        rowsPerPageOptions,
        count: totalRecords,
        onFilterChange: (column, filterList) => {
          const columnIndex = columns.findIndex(c => c.name === column);
          filterManager.ChangeExtraFilter({
            [column as string]: filterList[columnIndex].length
              ? filterList[columnIndex][0]
              : null,
          });
        },
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
