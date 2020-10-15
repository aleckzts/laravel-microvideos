import React from 'react';

import { Box, Container, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    color: '#999999',
  },
});

type PageProps = {
  title: string;
};

const Page: React.FC<PageProps> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Container>
      <Typography className={classes.title} component="h1" variant="h5">
        {title}
      </Typography>
      <Box paddingTop={2}>{children}</Box>
    </Container>
  );
};

export default Page;
