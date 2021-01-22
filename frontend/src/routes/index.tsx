import { RouteProps } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/Category/List';
import CategoryForm from '../pages/Category/PageForm';
import CastMemberList from '../pages/CastMember/List';
import CastMemberForm from '../pages/CastMember/PageForm';
import GenreList from '../pages/Genre/List';
import GenreForm from '../pages/Genre/PageForm';

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
    component: CategoryForm,
    exact: true,
  },
  {
    name: 'categories.edit',
    label: 'Editar categoria',
    path: '/categories/:id/edit',
    component: CategoryForm,
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
    component: CastMemberForm,
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
    component: GenreForm,
    exact: true,
  },
];

export default routes;
