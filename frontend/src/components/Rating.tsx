import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    width: '36px',
    height: '36px',
    fontSize: '1.2em',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const backgroundColors = {
  L: '#39B549',
  '10': '#20A3D4',
  '12': '#E79738',
  '14': '#E35E00',
  '16': '#d00003',
  '18': '#000000',
};

export type RatingTypes = 'L' | '10' | '12' | '14' | '16' | '18';

interface RatingProps {
  rating: RatingTypes;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const classes = useStyles();

  return (
    <Typography
      className={classes.root}
      style={{
        backgroundColor: backgroundColors[rating],
      }}
    >
      {rating}
    </Typography>
  );
};

export default Rating;
