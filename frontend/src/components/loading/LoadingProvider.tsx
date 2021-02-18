import React, { useEffect, useMemo, useState } from 'react';
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
  const [countRequest, setCountRequest] = useState(0);

  function incrementCountRequest(): void {
    setCountRequest(prevCountRequest => prevCountRequest + 1);
  }

  function decrementCountRequest(): void {
    setCountRequest(prevCountRequest => prevCountRequest - 1);
  }

  useMemo(() => {
    let isSubscribed = true;
    const requestIds = addGlobalRequestInterceptor(config => {
      if (isSubscribed) {
        setLoading(true);
        incrementCountRequest();
      }
      return config;
    });
    const responseIds = addGlobalResponseInterceptor(
      response => {
        if (isSubscribed) {
          // setLoading(false);
          decrementCountRequest();
        }
        return response;
      },
      error => {
        if (isSubscribed) {
          // setLoading(false);
          decrementCountRequest();
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

  useEffect(() => {
    if (!countRequest) {
      setLoading(false);
    }
  }, [countRequest]);

  return (
    <LoadingContext.Provider value={loading}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
