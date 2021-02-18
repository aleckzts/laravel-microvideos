import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';

import './App.css';

import MySnackbarProvider from './components/MySnackbarProvider';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';

import theme from './theme';
import Spinner from './components/Spinner';
import LoadingProvider from './components/loading/LoadingProvider';

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <LoadingProvider>
        <MySnackbarProvider>
          <CssBaseline />
          <BrowserRouter>
            <Spinner />
            <Navbar />
            <Box paddingTop="70px">
              <Breadcrumbs />
              <AppRouter />
            </Box>
          </BrowserRouter>
        </MySnackbarProvider>
      </LoadingProvider>
    </MuiThemeProvider>
  );
};

export default App;
