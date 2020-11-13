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

import httpVideo from '../../services/api';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

const GenreForm: React.FC = () => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
  };

  const [categories, setCategories] = useState<any[]>([]);

  const { register, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: {
      categories_id: [],
    },
  });

  useEffect(() => {
    register({ name: 'categories_id' });
  }, [register]);

  useEffect(() => {
    httpVideo
      .get('/categories')
      .then(response => setCategories(response.data.data));
  }, []);

  const handleChangeMultiple = (
    event: React.ChangeEvent<{ value: unknown }>,
  ): void => {
    const values = event.target.value as unknown[];
    setValue('categories_id', values as never[]);
  };

  function onSubmit(formData: any): void {
    httpVideo
      .post('/genres', formData)
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
        select
        name="categories_id"
        value={watch('categories_id')}
        label="Categorias"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange={handleChangeMultiple}
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

export default GenreForm;
