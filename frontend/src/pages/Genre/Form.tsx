import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  makeStyles,
  MenuItem,
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

interface GenreType {
  id: string;
  name: string;
  categories_id: string[];
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
  categories_id: Yup.array().label('Categorias').required(),
});

const GenreForm: React.FC = () => {
  const classes = useStyles();

  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<PageParams>();
  const [genre, setGenre] = useState<GenreType | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
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
      categories_id: [],
    },
  });

  async function onSubmit(formData: any, event: any): Promise<void> {
    setLoading(true);
    try {
      const http = !genre
        ? httpVideo.post('/genres', formData)
        : httpVideo.put(`/genres/${genre.id}`, formData);

      const response = await http;
      snackbar.enqueueSnackbar('Gênero salvo com sucesso', {
        variant: 'success',
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/genres/${response.data.data.id}/edit`)
            : history.push(`/genres/${response.data.data.id}/edit`)
          : history.push('/genres');
      });
    } catch (err) {
      console.log(err);
      snackbar.enqueueSnackbar('Erro ao salvar gênero', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    register({ name: 'categories_id' });
  }, [register]);

  useEffect(() => {
    httpVideo
      .get('/categories')
      .then(response => setCategories(response.data.data));
  }, []);

  useEffect(() => {
    register({ name: 'type' });
  }, [register]);

  useEffect(() => {
    async function getGenre(): Promise<void> {
      setLoading(true);
      try {
        const response = await httpVideo.get(`/genres/${id}`);
        setGenre(response.data.data);
        reset({
          ...response.data.data,
          categories_id: response.data.data.categories.map(
            (category: any) => category.id,
          ),
        });
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
      getGenre();
    }
  }, [reset, id, snackbar]);

  const handleChangeMultiple = (
    event: React.ChangeEvent<{ value: unknown }>,
  ): void => {
    const values = event.target.value as unknown[];
    setValue('categories_id', values as never[]);
  };

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
        select
        name="categories_id"
        value={watch('categories_id')}
        label="Categorias"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange={handleChangeMultiple}
        disabled={loading}
        error={errors.categories_id !== undefined}
        helperText={errors.categories_id && errors.categories_id.message}
        InputLabelProps={{ shrink: true }}
        SelectProps={{
          multiple: true,
        }}
      >
        <MenuItem value="" disabled>
          <em>Selecione as categorias</em>
        </MenuItem>
        {categories.map(categoryItem => (
          <MenuItem key={categoryItem.id} value={categoryItem.id}>
            {categoryItem.name}
          </MenuItem>
        ))}
      </TextField>
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

export default GenreForm;
