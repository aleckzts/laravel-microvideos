import { FormControl, FormHelperText, Typography } from '@material-ui/core';
import React, {
  MutableRefObject,
  RefAttributes,
  useImperativeHandle,
  useRef,
} from 'react';
import AsyncAutocomplete, {
  AsyncAutocompleteComponent,
} from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import GenreApi from '../../../services/GenreApi';
import getGenresFromCategory from '../../../utils/modelFilters';

interface GenreFieldProps extends RefAttributes<GenreFieldComponent> {
  genres: any[];
  setGenres: (value: any[]) => void;
  categories: any[];
  setCategories: (value: any[]) => void;
  error: any;
  disabled?: boolean;
}

export interface GenreFieldComponent {
  clear: () => void;
}

const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps>(
  ({ genres, setGenres, categories, setCategories, error, disabled }, ref) => {
    const autocompleteRef = useRef() as MutableRefObject<
      AsyncAutocompleteComponent
    >;
    // const GenreField: React.FC<GenreFieldProps> = ({
    //   genres,
    //   setGenres,
    //   categories,
    //   setCategories,
    //   error,
    //   disabled,
    // }) => {
    const autocompleteHttp = useHttpHandled();
    const { addItem, removeItem } = useCollectionManager(genres, setGenres);
    const { removeItem: removeCategory } = useCollectionManager(
      categories,
      setCategories,
    );

    const fetchOptions = async (searchText: string): Promise<any> =>
      autocompleteHttp(
        GenreApi.list({
          queryParams: { search: searchText, all: '' },
        }),
      );

    useImperativeHandle(ref, () => ({
      clear: () => autocompleteRef.current.clear(),
    }));

    return (
      <>
        <AsyncAutocomplete
          ref={autocompleteRef}
          fetchOptions={fetchOptions}
          TextFieldProps={{ label: 'Gêneros', error: error !== undefined }}
          AutocompleteProps={{
            getOptionLabel: (option: any) => option.name,
            onChange: (event, value) => addItem(value),
            disabled,
          }}
        />
        <FormControl
          margin="normal"
          fullWidth
          error={error !== undefined}
          disabled={disabled}
        >
          <GridSelected>
            {genres.map(genre => (
              <GridSelectedItem
                key={genre.id}
                onClick={() => {
                  const categoriesWithOneGenre = categories.filter(category => {
                    const genresFromCategory = getGenresFromCategory(
                      genres,
                      category,
                    );
                    return (
                      genresFromCategory.length === 1 &&
                      genres[0].id === genre.id
                    );
                  });
                  categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                  removeItem(genre);
                }}
                xs={12}
              >
                <Typography noWrap>{genre.name}</Typography>
              </GridSelectedItem>
            ))}
          </GridSelected>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      </>
    );
  },
);

export default GenreField;
