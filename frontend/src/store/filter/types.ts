import { AnyAction } from 'redux';

interface PaginationType {
  page: number;
  per_page: number;
}

interface OrderType {
  sort: string | null;
  dir: string | null;
}

export interface FilterStateType {
  search: string | { value: string | null; [key: string]: any } | null;
  pagination: PaginationType;
  order: OrderType;
  extraFilter?: { [key: string]: any };
}

export interface SetSearchAction extends AnyAction {
  payload: {
    search: string | { value: string | null; [key: string]: any } | null;
  };
}

export interface SetPageAction extends AnyAction {
  payload: {
    page: number;
  };
}

export interface SetPerPageAction extends AnyAction {
  payload: {
    per_page: number;
  };
}

export interface SetOrderAction extends AnyAction {
  payload: {
    sort: string | null;
    dir: string | null;
  };
}

export interface SetResetAction extends AnyAction {
  payload: {
    state: FilterStateType;
  };
}

export interface UpdateExtraFilterAction extends AnyAction {
  payload: {
    [key: string]: any;
  };
}

export type FilterActions =
  | SetSearchAction
  | SetPageAction
  | SetPerPageAction
  | SetOrderAction
  | SetResetAction
  | UpdateExtraFilterAction;
