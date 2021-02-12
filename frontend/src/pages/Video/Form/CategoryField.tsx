import { Typography } from '@material-ui/core';
import React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CategoryApi from '../../../services/CategoryApi';

const CategoryField: React.FC = () => {
  const autocompleteHttp = useHttpHandled();
  const fetchOptions = async (searchText: string): Promise<any> =>
    autocompleteHttp(
      CategoryApi.list({
        queryParams: { search: searchText, all: '' },
      }),
    );

  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        TextFieldProps={{ label: 'Categorias' }}
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

export default CategoryField;
