import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Yup from '../../yupBR';

import { CategoryType } from '../Category/Form';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';
import GenreApi from '../../services/GenreApi';
import CategoryApi from '../../services/CategoryApi';

export interface PageParams {
  id: string;
}

export interface GenreType {
  id: string;
  name: string;
  is_active: boolean;
  categories: CategoryType[];
}

interface GenreFormType extends GenreType {
  categories_id: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Nome').required().max(255),
  categories_id: Yup.array().label('Categorias').required(),
});

const GenreForm: React.FC = () => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<PageParams>();
  const [genre, setGenre] = useState<GenreType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    reset,
    watch,
    trigger,
  } = useForm<GenreFormType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: '',
      name: '',
      is_active: true,
      categories: [],
      categories_id: [],
    },
  });

  async function onSubmit(formData: any, event: any): Promise<void> {
    setLoading(true);
    try {
      const http = !genre
        ? GenreApi.create(formData)
        : GenreApi.update(genre.id, formData);

      const response = await http;
      snackbar.enqueueSnackbar('Gênero salvo com sucesso', {
        variant: 'success',
      });

      setTimeout(() => {
        if (event) {
          id
            ? history.replace(`/genres/${response.data.data.id}/edit`)
            : history.push(`/genres/${response.data.data.id}/edit`);
        } else {
          history.push('/genres');
        }
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
    CategoryApi.list({
      queryParams: { all: '' },
    }).then(response => setCategories(response.data.data));
  }, []);

  useEffect(() => {
    register({ name: 'type' });
    register({ name: 'is_active' });
  }, [register]);

  useEffect(() => {
    async function getGenre(): Promise<void> {
      setLoading(true);
      try {
        const response = await GenreApi.get(id);
        setGenre(response.data.data);
        reset({
          ...response.data.data,
          categories_id: response.data.data.categories.map(
            category => category.id,
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
  console.log(errors);

  return (
    <DefaultForm
      onSubmit={handleSubmit(onSubmit)}
      GridItemProps={{ xs: 12, md: 6 }}
    >
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
        // helperText={errors.categories_id && errors.categories_id.message}
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
      <SubmitActions
        disableButtons={loading}
        handleSave={() => {
          trigger().then(isValid => {
            isValid && onSubmit(getValues(), null);
          });
        }}
      />
    </DefaultForm>
  );
};

export default GenreForm;
