import React from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../components/Page';
import CastMemberForm, { PageParams } from './Form';

const CastMemberCreate: React.FC = () => {
  const { id } = useParams<PageParams>();

  return (
    <Page title={!id ? 'Criar Membro de Elenco' : 'Editar Membro de Elenco'}>
      <CastMemberForm />
    </Page>
  );
};

export default CastMemberCreate;
