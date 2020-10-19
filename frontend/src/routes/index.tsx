import { RouteProps } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/Category/List';
import CategoryCreate from '../pages/Category/Create';
import CastMemberList from '../pages/CastMember/List';
import CastMemberCreate from '../pages/CastMember/Create';
import GenreList from '../pages/Genre/List';
import GenreCreate from '../pages/Genre/Create';

export interface MyRouteProps extends RouteProps {
  name: string;
  label: string;
}

const routes: MyRouteProps[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/',
    component: Dashboard,
    exact: true,
  },
  {
    name: 'categories.list',
    label: 'Listar categorias',
    path: '/categories',
    component: CategoryList,
    exact: true,
  },
  {
    name: 'categories.create',
    label: 'Criar categoria',
    path: '/categories/create',
    component: CategoryCreate,
    exact: true,
  },
  {
    name: 'cast_members.list',
    label: 'Listar membros de elenco',
    path: '/cast-members',
    component: CastMemberList,
    exact: true,
  },
  {
    name: 'cast_members.create',
    label: 'Criar membro de elenco',
    path: '/cast-members/create',
    component: CastMemberCreate,
    exact: true,
  },
  {
    name: 'genres.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true,
  },
  {
    name: 'genres.create',
    label: 'Criar gênero',
    path: '/genres/create',
    component: GenreCreate,
    exact: true,
  },
];

export default routes;
