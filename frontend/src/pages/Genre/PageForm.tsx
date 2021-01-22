import React from 'react';
import Page from '../../components/Page';

import GenreForm from './Form';

const GenreCreate: React.FC = () => {
  return (
    <Page title="Criar Gênero">
      <GenreForm />
    </Page>
  );
};

export default GenreCreate;
