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

import Yup from '../../yupBR';

interface CategoryType {
  name: string;
  description?: string;
  is_active: boolean;
}

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
    color: 'secondary',
    variant: 'contained',
  };

  const { register, handleSubmit, getValues, errors } = useForm<CategoryType>({
    defaultValues: {
      name: '',
      is_active: true,
    },
  });

  async function onSubmit(formData: any): Promise<void> {
    const validationSchema = Yup.object().shape({
      name: Yup.string().label('Nome').required(),
    });

    try {
      await validationSchema.validate(formData, {
        abortEarly: false,
      });

      httpVideo
        .post('/categories', formData)
        .then(response => console.log(response.data));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        inputRef={register}
        error={errors.name !== undefined}
        helperText={errors.name && errors.name.message}
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
      <Checkbox
        name="is_active"
        color="primary"
        inputRef={register}
        defaultChecked
      />
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
