import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Page from '../../components/Page';
import VideoTable from './Table';

const VideoList: React.FC = () => {
  return (
    <Page title="Listagem de Videos">
      <Box dir="rtl" paddingBottom={2}>
        <Fab
          title="Adicionar Video"
          color="secondary"
          size="small"
          component={Link}
          to="/videos/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <VideoTable />
      </Box>
    </Page>
  );
};

export default VideoList;
