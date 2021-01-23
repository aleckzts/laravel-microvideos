import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, MuiThemeProvider, CssBaseline } from '@material-ui/core';

import './App.css';

import MySnackbarProvider from './components/MySnackbarProvider';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';

import theme from './theme';

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <MySnackbarProvider>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Box paddingTop="70px">
            <Breadcrumbs />
            <AppRouter />
          </Box>
        </BrowserRouter>
      </MySnackbarProvider>
    </MuiThemeProvider>
  );
};

export default App;
