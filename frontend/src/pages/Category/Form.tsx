import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button/Button';
import { useForm } from 'react-hook-form';
import httpVideo from '../../services/api';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

const CategoryForm: React.FC = () => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    variant: 'outlined',
  };

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      is_active: true,
    },
  });

  function onSubmit(formData: any): void {
    httpVideo
      .post('/categories', formData)
      .then(response => console.log(response.data));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        inputRef={register}
      />
      <TextField
        name="description"
        label="Descrição"
        multiline
        rows="4"
        fullWidth
        variant="outlined"
        margin="normal"
        inputRef={register}
      />
      <Checkbox name="is_active" inputRef={register} defaultChecked />
      Ativo?
      <Box dir="rtl">
        <Button {...buttonProps} onClick={() => onSubmit(getValues())}>
          Salvar
        </Button>
        <Button {...buttonProps} type="submit">
          Salvar e Continuar editando
        </Button>
      </Box>
    </form>
  );
};

export default CategoryForm;
