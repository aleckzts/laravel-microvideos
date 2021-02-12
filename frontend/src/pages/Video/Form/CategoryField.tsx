import { FormControl, FormHelperText, Typography } from '@material-ui/core';
import React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import CategoryApi from '../../../services/CategoryApi';
import getGenresFromCategory from '../../../utils/modelFilters';

interface CategoryFieldProps {
  categories: any[];
  setCategories: (value: any[]) => void;
  genres: any[];
  error: any;
  disabled?: boolean;
}

const CategoryField: React.FC<CategoryFieldProps> = ({
  categories,
  setCategories,
  genres,
  error,
  disabled,
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
        TextFieldProps={{ label: 'Categories', error: error !== undefined }}
        AutocompleteProps={{
          getOptionLabel: (option: any) => option.name,
          onChange: (event, value) => addItem(value),
          freeSolo: undefined,
          disabled: disabled || !genres.length,
        }}
      />
      <FormControl
        margin="normal"
        fullWidth
        error={error !== undefined}
        disabled={disabled}
      >
        <GridSelected>
          {categories.map(category => (
            <GridSelectedItem
              key={category.id}
              onClick={() => removeItem(category)}
              xs={12}
            >
              <Typography noWrap>{category.name}</Typography>
              <Typography
                noWrap
                style={{ color: '#0f0f0f', fontSize: '0.8rem' }}
              >
                Gêneros:
                {getGenresFromCategory(genres, category)
                  .map(genre => genre.name)
                  .join(',')}
              </Typography>
            </GridSelectedItem>
          ))}
        </GridSelected>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default CategoryField;
