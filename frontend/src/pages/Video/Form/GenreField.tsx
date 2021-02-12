import { Typography } from '@material-ui/core';
import React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useHttpHandled from '../../../hooks/useHttpHandled';
import GenreApi from '../../../services/GenreApi';

const GenreField: React.FC = () => {
  const autocompleteHttp = useHttpHandled();
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
        }}
      />
      <GridSelected>
        <GridSelectedItem onClick={() => {}} xs={6}>
          <Typography noWrap>Teste</Typography>
        </GridSelectedItem>
      </GridSelected>
    </>
  );
};

export default GenreField;
