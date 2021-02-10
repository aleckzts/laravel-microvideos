import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Yup from '../../yupBR';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';
import VideoApi from '../../services/VideoApi';
import { GenreType } from '../Genre/Form';
import { CategoryType } from '../Category/Form';
import { CastMemberType } from '../CastMember/Form';

export interface PageParams {
  id: string;
}

type GenreVideo = Omit<GenreType, 'categories'>;

export const VideoFileFieldsMap = {
  thumb_file: 'Thumbnail',
  banner_file: 'Banner',
  trailer_file: 'Trailer',
  video_file: 'Principal',
};

export interface VideoType {
  readonly id: string;
  title: string;
  description?: string;
  year_launched: number;
  opened: boolean;
  rating: string;
  duration: number;
  genres: GenreVideo[];
  categories: CategoryType[];
  cast_members: CastMemberType[];
  thumb_file_url: string;
  banner_file_url: string;
  trailer_file_url: string;
  video_file_url: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().label('Título').required().max(255),
  description: Yup.string().label('Sinopse').required(),
  year_launched: Yup.number().label('Ano de lançamento').required().min(1),
  duration: Yup.number().label('Duração').required().min(1),
  rating: Yup.string().label('Classificação').required(),
});

const VideoForm: React.FC = () => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id } = useParams<PageParams>();
  const [video, setVideo] = useState<VideoType | null>(null);
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
  } = useForm<VideoType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: '',
      title: '',
      year_launched: 0,
      opened: false,
      rating: '',
      duration: 0,
      genres: [],
      categories: [],
      cast_members: [],
      thumb_file_url: '',
      banner_file_url: '',
      trailer_file_url: '',
      video_file_url: '',
    },
  });

  async function onSubmit(formData: any, event: any): Promise<void> {
    setLoading(true);
    try {
      const http = !video
        ? VideoApi.create(formData)
        : VideoApi.update(video.id, formData);
      const response = await http;
      snackbar.enqueueSnackbar('Video salvo com sucesso', {
        variant: 'success',
      });
      setTimeout(() => {
        if (event) {
          id
            ? history.replace(`/videos/${response.data.data.id}/edit`)
            : history.push(`/videos/${response.data.data.id}/edit`);
        } else {
          history.push('/videos');
        }
      });
    } catch (err) {
      console.log(err);
      snackbar.enqueueSnackbar('Erro ao salvar video', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    register({ name: 'opened' });
  }, [register]);

  useEffect(() => {
    async function getVideo(): Promise<void> {
      setLoading(true);
      try {
        const response = await VideoApi.get(id);
        setVideo(response.data.data);
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
      getVideo();
    }
  }, [reset, id, snackbar]);

  return (
    <DefaultForm onSubmit={handleSubmit(onSubmit)} GridItemProps={{ xs: 12 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            name="title"
            label="Título"
            fullWidth
            variant="outlined"
            inputRef={register}
            disabled={loading}
            error={errors.title !== undefined}
            helperText={errors.title && errors.title.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="description"
            label="Sinopse"
            multiline
            rows="4"
            margin="normal"
            variant="outlined"
            fullWidth
            inputRef={register}
            disabled={loading}
            error={errors.description !== undefined}
            helperText={errors.description && errors.description.message}
            InputLabelProps={{ shrink: true }}
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                name="year_launched"
                label="Ano de lançamento"
                type="number"
                margin="normal"
                fullWidth
                variant="outlined"
                inputRef={register}
                disabled={loading}
                error={errors.year_launched !== undefined}
                helperText={
                  errors.year_launched && errors.year_launched.message
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="duration"
                label="Duração"
                type="number"
                margin="normal"
                fullWidth
                variant="outlined"
                inputRef={register}
                disabled={loading}
                error={errors.duration !== undefined}
                helperText={errors.duration && errors.duration.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          Elenco
          <br />
          Gêneros e categorias
        </Grid>
        <Grid item xs={12} md={6}>
          Classificação
          <br />
          Uploads
          <br />
          <FormControlLabel
            disabled={loading}
            control={
              <Checkbox
                name="opened"
                color="primary"
                onChange={() => setValue('opened', !getValues().opened)}
                checked={watch('opened')}
                disabled={loading}
              />
            }
            label={
              <Typography color="primary" variant="subtitle2">
                Quero que este conteúdo apareça na seção lançamentos
              </Typography>
            }
            labelPlacement="end"
          />
        </Grid>
      </Grid>
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

export default VideoForm;
