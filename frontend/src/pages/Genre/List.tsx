import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Page from '../../components/Page';
import GenreTable from './Table';

const GenreList: React.FC = () => {
  return (
    <Page title="Listagem de Gêneros">
      <Box dir="rtl">
        <Fab
          title="Adicionar Gênero"
          size="small"
          component={Link}
          to="/genres/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <GenreTable />
      </Box>
    </Page>
  );
};

export default GenreList;
