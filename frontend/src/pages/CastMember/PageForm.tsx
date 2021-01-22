import React from 'react';
import Page from '../../components/Page';

import CastMemberForm from './Form';

const CastMemberCreate: React.FC = () => {
  return (
    <Page title="Criar Membro de Elenco">
      <CastMemberForm />
    </Page>
  );
};

export default CastMemberCreate;
