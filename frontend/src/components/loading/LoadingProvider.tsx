import React, { useMemo, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

import LoadingContext from './LoadingContext';
import {
  addGlobalRequestInterceptor,
  addGlobalResponseInterceptor,
  removeGlobalRequestIntercptor,
  removeGlobalResponseIntercptor,
} from '../../services/api';

const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    let isSubscribed = true;
    const requestIds = addGlobalRequestInterceptor(config => {
      if (isSubscribed) {
        setLoading(true);
      }
      return config;
    });
    const responseIds = addGlobalResponseInterceptor(
      response => {
        if (isSubscribed) {
          setLoading(false);
        }
        return response;
      },
      error => {
        if (isSubscribed) {
          setLoading(false);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      isSubscribed = false;
      removeGlobalRequestIntercptor(requestIds);
      removeGlobalResponseIntercptor(responseIds);
    };
  }, []);

  return (
    <LoadingContext.Provider value={loading}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
