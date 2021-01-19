import React from 'react';
import { VideosTable } from './videos-table';
import { Typography } from '@material-ui/core';

const Home: React.FC = () => {

  return (
    <>
        <Typography variant="h6" component="h1">VManager Demo c0.0.1 </Typography>
        <VideosTable />
    </>
  );
};

export default Home;
