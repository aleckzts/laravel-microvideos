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
import Yup from '../../yupBR';
import CategoryApi from '../../services/CategoryApi';
import GenreApi from '../../services/GenreApi';

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
            to={`/videos/${tableMeta.rowData[0]}/edit`}
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
          genres: Yup.mixed()
            .nullable()
            .transform(value => {
              return !value || value === '' ? undefined : value.split(',');
            })
            .default(null),
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
              ...(debouncedState.extraFilter.genres && {
                genres: debouncedState.extraFilter.genres.join(','),
              }),
              ...(debouncedState.extraFilter.categories && {
                categories: debouncedState.extraFilter.categories.join(','),
              }),
            }
          : undefined;
      },
      getStateFromURL: queryParams => {
        return {
          genres: queryParams.get('genres'),
          categories: queryParams.get('categories'),
        };
      },
    },
  });

  const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue =
    filterState.extraFilter && filterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue || [];

  const indexColumnGenres = columns.findIndex(c => c.name === 'genres');
  const columnGenres = columns[indexColumnGenres];
  const genresFilterValue =
    filterState.extraFilter && filterState.extraFilter.genres;
  (columnGenres.options as any).filterList = genresFilterValue || [];

  const serverSideFilterList = columns.map(column => []);
  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }
  if (genresFilterValue) {
    serverSideFilterList[indexColumnGenres] = genresFilterValue;
  }

  useEffect(() => {
    isCancelled.current = false;

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await GenreApi.list({
          queryParams: {
            all: '',
          },
        });
        if (!isCancelled.current) {
          (columnGenres.options as any).filterOptions.names = response.data.data.map(
            genre => genre.name,
          );
          console.log('teste', columnGenres.options?.filterOptions?.names);
        }
      } catch (err) {
        console.log(err);
        if (GenreApi.isRequestCancelled(err)) {
          return;
        }
        snackbar.enqueueSnackbar('Não foi possível carregar os gêneros', {
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
  }, [snackbar, columnGenres.options]);
  console.log(columnGenres.options?.filterOptions?.names);
  console.log(columnCategories.options?.filterOptions?.names);

  useEffect(() => {
    isCancelled.current = false;

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await CategoryApi.list({
          queryParams: {
            all: '',
          },
        });
        if (!isCancelled.current) {
          (columnCategories.options as any).filterOptions.names = response.data.data.map(
            category => category.name,
          );
        }
      } catch (err) {
        console.log(err);
        if (CategoryApi.isRequestCancelled(err)) {
          return;
        }
        snackbar.enqueueSnackbar('Não foi possível carregar as categorias', {
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
  }, [snackbar, columnCategories.options]);

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
            ...(debouncedFilterState.extraFilter &&
              debouncedFilterState.extraFilter.genres && {
                genres: debouncedFilterState.extraFilter.genres.toString(),
              }),
            ...(debouncedFilterState.extraFilter &&
              debouncedFilterState.extraFilter.categories && {
                categories: debouncedFilterState.extraFilter.categories.toString(),
              }),
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
    debouncedFilterState.extraFilter,
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
        onFilterChange: (column, filterList) => {
          const columnIndex = columns.findIndex(c => c.name === column);
          filterManager.ChangeExtraFilter({
            [column as string]: filterList[columnIndex].length
              ? filterList[columnIndex]
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

export default VideoTable;
