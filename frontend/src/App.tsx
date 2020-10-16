import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';

import './App.css';

import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Box paddingTop="70px">
        <Breadcrumbs />
        <AppRouter />
      </Box>
    </BrowserRouter>
  );
};

export default App;
