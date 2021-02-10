import React from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../components/Page';
import VideoForm, { PageParams } from './Form';

const VideoCreate: React.FC = () => {
  const { id } = useParams<PageParams>();

  return (
    <Page title={!id ? 'Criar Video' : 'Editar Video'}>
      <VideoForm />
    </Page>
  );
};

export default VideoCreate;
