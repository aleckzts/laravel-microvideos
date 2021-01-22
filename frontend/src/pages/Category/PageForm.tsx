import React from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../components/Page';

import CategoryForm, { PageParams } from './Form';

const CategoryCreate: React.FC = () => {
  const { id } = useParams<PageParams>();

  return (
    <Page title={!id ? 'Criar Categoria' : 'Editar Categoria'}>
      <CategoryForm />
    </Page>
  );
};

export default CategoryCreate;
