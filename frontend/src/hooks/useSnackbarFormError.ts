import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';

interface SnackbarFormErrorProps {
  submitCount: number;
  errors: any;
}

const useSnackbarFormError: React.FC<SnackbarFormErrorProps> = ({
  submitCount,
  errors,
}) => {
  const snackbar = useSnackbar();
  console.log(submitCount, errors);

  useEffect(() => {
    const hasError = Object.keys(errors).length !== 0;
    if (submitCount > 0 && hasError) {
      snackbar.enqueueSnackbar(
        'Formulário inválido Reveja os campos em vermelho.',
        { variant: 'error' },
      );
    }
  }, [snackbar, submitCount, errors]);

  return null;
};

export default useSnackbarFormError;
