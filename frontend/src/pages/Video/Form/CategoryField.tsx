import { Typography } from '@material-ui/core';
import React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CategoryApi from '../../../services/CategoryApi';

interface CategoryFieldProps {
  categories: any[];
  setCategories: (value: any[]) => void;
  genres: any[];
}

const CategoryField: React.FC<CategoryFieldProps> = ({
  categories,
  setCategories,
  genres,
}) => {
  const autocompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(
    categories,
    setCategories,
  );

  const fetchOptions = async (searchText: string): Promise<any> =>
    autocompleteHttp(
      CategoryApi.list({
        queryParams: {
          genres: genres.map(genre => genre.id).join(','),
          all: '',
        },
      }),
    );

  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        TextFieldProps={{ label: 'Categories' }}
        AutocompleteProps={{
          getOptionLabel: (option: any) => option.name,
          onChange: (event, value) => addItem(value),
          freeSolo: undefined,
        }}
      />
      <GridSelected>
        {categories.map(category => (
          <GridSelectedItem key={category.id} onClick={() => {}} xs={12}>
            <Typography noWrap>{category.name}</Typography>
          </GridSelectedItem>
        ))}
      </GridSelected>
    </>
  );
};

export default CategoryField;
