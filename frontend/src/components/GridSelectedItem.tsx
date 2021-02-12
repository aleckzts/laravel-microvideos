import React from 'react';
import { Grid, GridProps as _GridProps, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

interface GridSelectedItemProps extends _GridProps {
  onClick: () => void;
}

const GridSelectedItem: React.FC<GridSelectedItemProps> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <Grid item {...props}>
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={1}>
          <IconButton size="small" color="inherit" onClick={onClick}>
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={10} md={11}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSelectedItem;
