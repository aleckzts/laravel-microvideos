import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';

import { ButtonProps } from '@material-ui/core/Button/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useParams } from 'react-router-dom';
import httpVideo from '../../services/api';

import Yup from '../../yupBR';

export interface PageParams {
  id: string;
}

interface CategoryType {
  id: string;
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

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Nome').required().max(255),
});

const CategoryForm: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<PageParams>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
    disabled: loading,
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    reset,
    watch,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_active: true,
    },
  });

  async function onSubmit(formData: any): Promise<void> {
    setLoading(true);
    const http = !category
      ? httpVideo.post('/categories', formData)
      : httpVideo.put(`/categories/${category.id}`, formData);

    http
      .then(response => console.log(response.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    register({ name: 'is_active' });
  }, [register]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      httpVideo
        .get(`/categories/${id}`)
        .then(response => {
          console.log(response);
          setCategory(response.data.data);
          reset(response.data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [reset, id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        inputRef={register}
        disabled={loading}
        error={errors.name !== undefined}
        helperText={errors.name && errors.name.message}
        InputLabelProps={{ shrink: true }}
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
        disabled={loading}
        InputLabelProps={{ shrink: true }}
      />
      <FormControlLabel
        disabled={loading}
        control={
          <Checkbox
            name="is_active"
            color="primary"
            onChange={() => setValue('is_active', !getValues().is_active)}
            checked={watch('is_active')}
          />
        }
        label="Ativo?"
        labelPlacement="end"
      />
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
