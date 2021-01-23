import React from 'react';
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  SnackbarProvider,
  SnackbarProviderProps,
  WithSnackbarProps,
} from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
  return {
    variantSuccess: {
      backgroundColor: theme.palette.success.main,
    },
    variantError: {
      backgroundColor: theme.palette.error.main,
    },
    variantInfo: {
      backgroundColor: theme.palette.primary.main,
    },
  };
});

const MySnackbarProvider: React.FC<SnackbarProviderProps> = (
  { children },
  ...props
) => {
  const classes = useStyles();

  let snackbarProviderRef: WithSnackbarProps;

  const defaultProps: SnackbarProviderProps = {
    classes,
    children: React.Children,
    autoHideDuration: 3000,
    maxSnack: 3,
    anchorOrigin: { horizontal: 'right', vertical: 'top' },
    ref: el => {
      snackbarProviderRef = el as WithSnackbarProps;
    },
    action: key => (
      <IconButton
        color="inherit"
        style={{ fontSize: 20 }}
        onClick={() => snackbarProviderRef.closeSnackbar(key)}
      >
        <CloseIcon />
      </IconButton>
    ),
  };

  const newprops = { ...defaultProps, ...props };

  return <SnackbarProvider {...newprops}>{children}</SnackbarProvider>;
};

export default MySnackbarProvider;
