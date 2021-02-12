import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      backgroundColor: '#f1f1f1',
      borderRadius: '4px',
      padding: theme.spacing(1, 1),
      color: theme.palette.secondary.main,
    },
  }),
);

const GridSelected: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid container wrap="wrap" className={classes.root}>
      {children}
    </Grid>
  );
};

export default GridSelected;
