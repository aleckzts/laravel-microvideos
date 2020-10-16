import React from 'react';
import Page from '../../components/Page';

import CategoryForm from './Form';

const CategoryCreate: React.FC = () => {
  return (
    <Page title="Criar Categoria">
      <CategoryForm />
    </Page>
  );
};

export default CategoryCreate;
