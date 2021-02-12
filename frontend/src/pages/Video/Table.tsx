import React, { useEffect, useRef, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';

import Table, { TableColumn, TableComponent } from '../../components/Table';
import VideoApi from '../../services/VideoApi';
import FilterResetButton from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import { VideoType } from './Form';
import { CategoryType } from '../Category/Form';
import { GenreType } from '../Genre/Form';

const columnsDefinition: TableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    width: '20%',
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: 'title',
    label: 'Título',
    width: '33%',
    options: {
      filter: false,
    },
  },
  {
    name: 'genres',
    label: 'Gêneros',
    width: '12%',
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
      customBodyRender(value: unknown) {
        const genres = value as Array<GenreType>;
        return <span>{genres.map(genre => genre.name).join(', ')}</span>;
      },
    },
  },
  {
    name: 'categories',
    label: 'Categorias',
    width: '12%',
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
      customBodyRender(value: unknown) {
        const categories = value as Array<CategoryType>;
        return (
          <span>{categories.map(category => category.name).join(', ')}</span>
        );
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
            to={`/categories/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        );
      },
    },
  },
];

const VideoTable: React.FC = () => {
  const snackbar = useSnackbar();
  const isCancelled = useRef(false);
  const [data, setData] = useState<VideoType[]>([]);
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
  });

  useEffect(() => {
    isCancelled.current = false;
    filterManager.pushHistory();

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await VideoApi.list({
          queryParams: {
            search: filterManager.cleanSearchText(debouncedFilterState.search),
            page: debouncedFilterState.pagination.page,
            per_page: debouncedFilterState.pagination.per_page,
            sort: debouncedFilterState.order.sort,
            dir: debouncedFilterState.order.dir,
          },
        });
        if (!isCancelled.current) {
          setData(response.data.data);
          setTotalRecords(response.data.meta.total);
        }
      } catch (err) {
        console.log(err);
        if (VideoApi.isRequestCancelled(err)) {
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
    debouncedFilterState.search,
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    snackbar,
    setTotalRecords,
  ]);

  return (
    <Table
      title="Listagem de Videos"
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

export default VideoTable;
