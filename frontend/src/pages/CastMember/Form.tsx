import React, { useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
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

const CastMemberForm: React.FC = () => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    variant: 'outlined',
  };

  const { register, handleSubmit, getValues, setValue } = useForm();

  useEffect(() => {
    register({ name: 'type' });
  }, [register]);

  function onSubmit(formData: any): void {
    httpVideo
      .post('/cast_members', formData)
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
      <FormControl margin="normal">
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name="type"
          onChange={event => {
            setValue('type', parseInt(event.target.value));
          }}
        >
          <FormControlLabel value="1" control={<Radio />} label="Diretor" />
          <FormControlLabel value="2" control={<Radio />} label="Ator" />
        </RadioGroup>
      </FormControl>
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

export default CastMemberForm;
