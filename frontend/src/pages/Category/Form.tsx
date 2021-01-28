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

import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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

  const snackbar = useSnackbar();
  const history = useHistory();
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

  async function onSubmit(formData: any, event: any): Promise<void> {
    setLoading(true);
    try {
      const http = !category
        ? httpVideo.post('/categories', formData)
        : httpVideo.put(`/categories/${category.id}`, formData);

      const response = await http;
      snackbar.enqueueSnackbar('Categoria salva com sucesso', {
        variant: 'success',
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/categories/${response.data.data.id}/edit`)
            : history.push(`/categories/${response.data.data.id}/edit`)
          : history.push('/categories');
      });
    } catch (err) {
      console.log(err);
      snackbar.enqueueSnackbar('Erro ao salvar categoria', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    register({ name: 'is_active' });
  }, [register]);

  useEffect(() => {
    async function getCategory(): Promise<void> {
      setLoading(true);
      try {
        const response = await httpVideo.get(`/categories/${id}`);
        setCategory(response.data.data);
        reset(response.data.data);
      } catch (err) {
        console.log(err);
        snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getCategory();
    }
  }, [reset, id, snackbar]);

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
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>
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
