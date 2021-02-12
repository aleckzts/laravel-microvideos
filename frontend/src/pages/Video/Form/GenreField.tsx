import { Typography } from '@material-ui/core';
import React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import GenreApi from '../../../services/GenreApi';

interface GenreFieldProps {
  genres: any[];
  setGenres: (value: any[]) => void;
}

const GenreField: React.FC<GenreFieldProps> = ({ genres, setGenres }) => {
  const autocompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(genres, setGenres);

  const fetchOptions = async (searchText: string): Promise<any> =>
    autocompleteHttp(
      GenreApi.list({
        queryParams: { search: searchText, all: '' },
      }),
    );

  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        TextFieldProps={{ label: 'Gêneros' }}
        AutocompleteProps={{
          getOptionLabel: (option: any) => option.name,
          onChange: (event, value) => addItem(value),
        }}
      />
      <GridSelected>
        {genres.map(genre => (
          <GridSelectedItem key={genre.id} onClick={() => {}} xs={12}>
            <Typography noWrap>{genre.name}</Typography>
          </GridSelectedItem>
        ))}
      </GridSelected>
    </>
  );
};

export default GenreField;
