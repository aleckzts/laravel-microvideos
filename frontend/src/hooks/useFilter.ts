import { MUIDataTableColumn } from 'mui-datatables';
import { Dispatch, Reducer, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { History } from 'history';
import { isEqual } from 'lodash';
import reducer, { Creators } from '../store/filter';
import { FilterActions, FilterStateType } from '../store/filter/types';
import Yup from '../yupBR';
import { TableComponent } from '../components/Table';

interface FilterManagerOptions {
  columns: MUIDataTableColumn[];
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  debounceWait: number;
  history: History;
  tableRef: React.MutableRefObject<TableComponent>;
}

export class FilterManager {
  state: FilterStateType = null as any;

  debouncedState: FilterStateType = null as any;

  dispatch: Dispatch<FilterActions> = null as any;

  columns: MUIDataTableColumn[];

  rowsPerPage: number;

  rowsPerPageOptions: number[];

  history: History;

  schema: any;

  tableRef: React.MutableRefObject<TableComponent>;

  constructor(options: FilterManagerOptions) {
    const {
      columns,
      rowsPerPage,
      rowsPerPageOptions,
      history,
      tableRef,
    } = options;

    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
    this.createValidationSchema();
    this.tableRef = tableRef;
  }

  private resetTablePagination() {
    this.tableRef.current.changeRowsPerPage(this.rowsPerPage);
    this.tableRef.current.changePage(0);
  }

  ChangeSearch(value: string) {
    this.dispatch(Creators.setSearch({ search: value }));
  }

  ChangePage(page: number) {
    this.dispatch(Creators.setPage({ page: page + 1 }));
  }

  ChangeRowsPerPage(perPage: number) {
    this.dispatch(Creators.setPerPage({ per_page: perPage }));
  }

  ChangeColumnSort(changedColumn: string, direction: string) {
    this.dispatch(
      Creators.setOrder({
        sort: changedColumn,
        dir: direction.includes('desc') ? 'desc' : 'asc',
      }),
    );
    this.resetTablePagination();
  }

  resetFilter() {
    const INITIAL_STATE = {
      ...this.schema.cast({}),
      search: { value: null, udpate: true },
    };
    this.dispatch(Creators.setReset({ state: INITIAL_STATE }));
    this.resetTablePagination();
  }

  cleanSearchText(text: any): string {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  private formatURLParams() {
    const search = this.cleanSearchText(this.debouncedState.search);
    return {
      ...(search && search !== '' && { search }),
      ...(this.debouncedState.pagination.page !== 1 && {
        page: this.debouncedState.pagination.page,
      }),
      ...(this.debouncedState.pagination.per_page !== 15 && {
        per_page: this.debouncedState.pagination.per_page,
      }),
      ...(this.debouncedState.order.sort && {
        sort: this.debouncedState.order.sort,
        dir: this.debouncedState.order.dir,
      }),
    };
  }

  replaceHistory() {
    this.history.replace({
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatURLParams() as any)}`,
      state: this.debouncedState,
    });
  }

  pushHistory() {
    const oldState = this.history.location.state;
    const nextState = this.debouncedState;

    if (isEqual(oldState, nextState)) {
      return;
    }

    this.history.push({
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatURLParams() as any)}`,
      state: {
        ...this.debouncedState,
        search: this.cleanSearchText(this.debouncedState.search),
      },
    });
  }

  private createValidationSchema() {
    this.schema = Yup.object().shape({
      search: Yup.string()
        .transform(value => (!value ? undefined : value))
        .default(''),
      pagination: Yup.object().shape({
        page: Yup.number()
          .transform(value =>
            isNaN(value) || parseInt(value, 10) < 1 ? undefined : value,
          )
          .default(1),
        per_page: Yup.number()
          .transform(value =>
            isNaN(value) ||
            !this.rowsPerPageOptions.includes(parseInt(value, 10))
              ? undefined
              : value,
          )
          .default(this.rowsPerPage),
      }),
      order: Yup.object().shape({
        sort: Yup.string()
          .nullable()
          .transform(value => {
            const columnsName = this.columns
              .filter(
                column => !column.options || column.options.sort !== false,
              )
              .map(column => column.name);
            return columnsName.includes(value) ? value : undefined;
          })
          .default(null),
        dir: Yup.string()
          .nullable()
          .transform(value =>
            !value || !['asc', 'desc'].includes(value.toLowerCase())
              ? undefined
              : value,
          )
          .default(null),
      }),
    });
  }

  getStateFromURL() {
    const queryParams = new URLSearchParams(
      this.history.location.search.substr(1),
    );
    return this.schema.cast({
      search: queryParams.get('search'),
      pagination: {
        page: queryParams.get('page'),
        per_page: queryParams.get('per_page'),
      },
      order: {
        sort: queryParams.get('sort'),
        dir: queryParams.get('dir'),
      },
    });
  }
}

function useFilter(options: Omit<FilterManagerOptions, 'history'>) {
  // const useFilter = forwardRef<React.FC, Omit<FilterManagerOptions, 'history'>>(props, ref) => {
  // const options = props;

  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const [filterState, dispatch] = useReducer<
    Reducer<FilterStateType, FilterActions>
  >(reducer, filterManager.getStateFromURL());
  const [debouncedFilterState] = useDebounce(filterState, options.debounceWait);
  const [totalRecords, setTotalRecords] = useState(0);

  filterManager.state = filterState;
  filterManager.debouncedState = debouncedFilterState;
  filterManager.dispatch = dispatch;

  useEffect(() => {
    filterManager.replaceHistory();
  }, []);

  return {
    filterManager,
    debouncedFilterState,
    filterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  };
}
export default useFilter;
