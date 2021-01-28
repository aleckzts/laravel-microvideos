import React from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../components/Page';
import GenreForm, { PageParams } from './Form';

const GenreCreate: React.FC = () => {
  const { id } = useParams<PageParams>();

  return (
    <Page title={!id ? 'Criar Gênero' : 'Editar Gênero'}>
      <GenreForm />
    </Page>
  );
};

export default GenreCreate;
