import axios from 'axios';
import { useSnackbar } from 'notistack';

const useHttpHandled = (): any => {
  const snackbar = useSnackbar();

  return async (request: Promise<any>) => {
    try {
      const response = await request;
      return response.data.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        return [];
      }
      snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
        variant: 'error',
      });
      throw err;
    }
  };
};

export default useHttpHandled;
