import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';

import './App.css';

import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';

import theme from './theme';

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Box paddingTop="70px">
          <Breadcrumbs />
          <AppRouter />
        </Box>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export default App;
