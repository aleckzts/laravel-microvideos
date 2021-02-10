import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Yup from '../../yupBR';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';
import CategoryApi from '../../services/CategoryApi';

export interface PageParams {
  id: string;
}

export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Nome').required().max(255),
});

const CategoryForm: React.FC = () => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<PageParams>();
  const [category, setCategory] = useState<CategoryType | null>(null);
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
  } = useForm<CategoryType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: '',
      name: '',
      is_active: true,
    },
  });

  async function onSubmit(formData: any, event: any): Promise<void> {
    setLoading(true);
    try {
      const http = !category
        ? CategoryApi.create(formData)
        : CategoryApi.update(category.id, formData);
      const response = await http;
      snackbar.enqueueSnackbar('Categoria salva com sucesso', {
        variant: 'success',
      });
      setTimeout(() => {
        if (event) {
          id
            ? history.replace(`/categories/${response.data.data.id}/edit`)
            : history.push(`/categories/${response.data.data.id}/edit`);
        } else {
          history.push('/categories');
        }
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
        const response = await CategoryApi.get(id);
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
            disabled={loading}
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

export default CategoryForm;
