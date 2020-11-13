import { Chip, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React from 'react';

import theme from '../../theme';

const BadgeTheme = createMuiTheme({
  palette: {
    primary: theme.palette.success,
    secondary: theme.palette.error,
  },
});

export const BadgeYes: React.FC = () => {
  return (
    <MuiThemeProvider theme={BadgeTheme}>
      <Chip label="Sim" color="primary" />
    </MuiThemeProvider>
  );
};

export const BadgeNo: React.FC = () => {
  return (
    <MuiThemeProvider theme={BadgeTheme}>
      <Chip label="Não" color="secondary" />
    </MuiThemeProvider>
  );
};
