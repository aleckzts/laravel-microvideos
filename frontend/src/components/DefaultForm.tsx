import React from 'react';
import { Grid, GridProps, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  griditem: {
    padding: theme.spacing(1, 0),
  },
}));

interface DefaultFormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  GridContainerProps?: GridProps;
  GridItemProps?: GridProps;
}

const DefaultForm: React.FC<DefaultFormProps> = ({
  GridContainerProps,
  GridItemProps,
  children,
  ...props
}) => {
  const classes = useStyles();

  return (
    <form {...props}>
      <Grid container {...GridContainerProps}>
        <Grid item className={classes.griditem} {...GridItemProps}>
          {children}
        </Grid>
      </Grid>
    </form>
  );
};

export default DefaultForm;
