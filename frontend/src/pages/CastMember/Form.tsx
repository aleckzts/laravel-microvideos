import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import httpVideo from '../../services/api';

import Yup from '../../yupBR';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';

export interface PageParams {
  id: string;
}

export interface CastMemberType {
  id: string;
  name: string;
  type: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Nome').required().max(255),
  type: Yup.number().label('Tipo').required(),
});

const CastMemberForm: React.FC = () => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<PageParams>();
  const [castMember, setCastMember] = useState<CastMemberType | null>(null);
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
  } = useForm<CastMemberType>({
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

export default CastMemberForm;
