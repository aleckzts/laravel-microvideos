import { createActions, createReducer } from 'reduxsauce';
import {
  SetOrderAction,
  SetPageAction,
  SetPerPageAction,
  SetResetAction,
  SetSearchAction,
  FilterStateType,
} from './types';

export const INITIAL_STATE: FilterStateType = {
  search: null,
  pagination: {
    page: 1,
    per_page: 15,
  },
  order: {
    sort: null,
    dir: null,
  },
};

export const { Types, Creators } = createActions<
  {
    SET_SEARCH: string;
    SET_PAGE: string;
    SET_PER_PAGE: string;
    SET_ORDER: string;
    SET_RESET: string;
  },
  {
    setSearch(payload: SetSearchAction['payload']): SetSearchAction;
    setPage(payload: SetPageAction['payload']): SetPageAction;
    setPerPage(payload: SetPerPageAction['payload']): SetPerPageAction;
    setOrder(payload: SetOrderAction['payload']): SetOrderAction;
    setReset(payload: SetResetAction['payload']): SetResetAction;
  }
>({
  setSearch: ['payload'],
  setPage: ['payload'],
  setPerPage: ['payload'],
  setOrder: ['payload'],
  setReset: ['payload'],
});

function SetSearch(
  state = INITIAL_STATE,
  action: SetSearchAction,
): FilterStateType {
  return {
    ...state,
    search: action.payload.search,
    pagination: {
      ...state.pagination,
      page: 1,
    },
  };
}

function SetPage(
  state = INITIAL_STATE,
  action: SetPageAction,
): FilterStateType {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      page: action.payload.page,
    },
  };
}

function SetPerPage(
  state = INITIAL_STATE,
  action: SetPerPageAction,
): FilterStateType {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      per_page: action.payload.per_page,
    },
  };
}

function SetOrder(
  state = INITIAL_STATE,
  action: SetOrderAction,
): FilterStateType {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      page: 1,
    },
    order: {
      sort: action.payload.sort,
      dir: action.payload.dir,
    },
  };
}

function SetReset(
  state = INITIAL_STATE,
  action: SetResetAction,
): FilterStateType {
  return action.payload.state;
}

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SEARCH]: SetSearch,
  [Types.SET_PAGE]: SetPage,
  [Types.SET_PER_PAGE]: SetPerPage,
  [Types.SET_ORDER]: SetOrder,
  [Types.SET_RESET]: SetReset,
});

export default reducer;
