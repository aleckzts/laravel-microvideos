import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Page from '../../components/Page';
import CategoryTable from './Table';

const CategoryList: React.FC = () => {
  return (
    <Page title="Listagem de Categorias">
      <Box dir="rtl" paddingBottom={2}>
        <Fab
          title="Adicionar Categoria"
          color="secondary"
          size="small"
          component={Link}
          to="/categories/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <CategoryTable />
      </Box>
    </Page>
  );
};

export default CategoryList;
