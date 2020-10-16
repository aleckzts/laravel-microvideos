import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Page from '../../components/Page';
import CastMemberTable from './Table';

const CastMemberList: React.FC = () => {
  return (
    <Page title="Listagem de Membros">
      <Box dir="rtl">
        <Fab
          title="Adicionar Membro"
          size="small"
          component={Link}
          to="/cast-members/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <CastMemberTable />
      </Box>
    </Page>
  );
};

export default CastMemberList;
