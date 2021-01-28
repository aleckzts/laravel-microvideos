import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
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

export interface CastMemberType {
  id: string;
  name: string;
  type: number;
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
  type: Yup.number().label('Tipo').required(),
});

const CastMemberForm: React.FC = () => {
  const classes = useStyles();

  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<PageParams>();
  const [castMember, setCastMember] = useState<CastMemberType | null>(null);
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
  });

  async function onSubmit(formData: any, event: any): Promise<void> {
    setLoading(true);
    try {
      const http = !castMember
        ? httpVideo.post('/cast_members', formData)
        : httpVideo.put(`/cast_members/${castMember.id}`, formData);

      const response = await http;
      snackbar.enqueueSnackbar('Membro de elenco salvo com sucesso', {
        variant: 'success',
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/cast-members/${response.data.data.id}/edit`)
            : history.push(`/cast-members/${response.data.data.id}/edit`)
          : history.push('/cast-members');
      });
    } catch (err) {
      console.log(err);
      snackbar.enqueueSnackbar('Erro ao salvar membro de elenco', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    register({ name: 'type' });
  }, [register]);

  useEffect(() => {
    async function getCastMember(): Promise<void> {
      setLoading(true);
      try {
        const response = await httpVideo.get(`/cast_members/${id}`);
        setCastMember(response.data.data);
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
      getCastMember();
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
      <FormControl
        margin="normal"
        disabled={loading}
        error={errors.type !== undefined}
      >
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name="type"
          value={`${watch('type')}`}
          onChange={event => {
            setValue('type', parseInt(event.target.value));
          }}
        >
          <FormControlLabel
            value="1"
            control={<Radio color="primary" />}
            label="Diretor"
          />
          <FormControlLabel
            value="2"
            control={<Radio color="primary" />}
            label="Ator"
          />
        </RadioGroup>
        {errors.type && (
          <FormHelperText id="type-helper-text">
            {errors.type.message}
          </FormHelperText>
        )}
      </FormControl>
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

export default CastMemberForm;
