import React, {
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Autocomplete,
  AutocompleteProps as _AutocompleteProps,
} from '@material-ui/lab';
import {
  CircularProgress,
  TextField,
  TextFieldProps as _TextFieldProps,
} from '@material-ui/core';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutocompleteProps
  extends RefAttributes<AsyncAutocompleteComponent> {
  fetchOptions: (searchText: any) => Promise<any[]>;
  debounceTime?: number;
  TextFieldProps?: _TextFieldProps;
  AutocompleteProps?: Omit<
    Omit<_AutocompleteProps<string, true, true, true>, 'renderInput'>,
    'options'
  >;
}

export interface AsyncAutocompleteComponent {
  clear: () => void;
}

const AsyncAutocomplete = React.forwardRef<
  AsyncAutocompleteComponent,
  AsyncAutocompleteProps
>(
  (
    { fetchOptions, debounceTime = 300, TextFieldProps, AutocompleteProps },
    ref,
  ) => {
    // const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = ({
    //   fetchOptions,
    //   debounceTime = 300,
    //   TextFieldProps,
    //   AutocompleteProps,
    // }) => {
    const freeSolo = AutocompleteProps?.freeSolo || false;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState<string>();
    const [debounceSearchText] = useDebounce(searchText, debounceTime);
    const [options, setOptions] = useState<any[]>([]);

    const defaultTextFieldProps: _TextFieldProps = {
      margin: 'normal',
      variant: 'outlined',
      fullWidth: true,
      InputLabelProps: { shrink: true },
      ...TextFieldProps,
    };

    const defaultAutocompleteProps: _AutocompleteProps<
      string,
      true,
      true,
      true
    > = {
      inputValue: searchText,
      loading,
      loadingText: 'Carregando...',
      freeSolo: true,
      clearOnEscape: true,
      clearOnBlur: true,
      getOptionSelected: (option: any, value: any) => option.id === value.id,
      ...AutocompleteProps,
      open,
      options,
      noOptionsText: 'Nenhum item encontrado',
      onOpen() {
        setOpen(true);
      },
      onClose() {
        setOpen(false);
      },
      onInputChange(event, value) {
        value && setSearchText(value);
      },
      renderInput: params => (
        <TextField
          {...params}
          {...defaultTextFieldProps}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      ),
    };

    useEffect(() => {
      async function getData(): Promise<void> {
        setLoading(true);
        try {
          const response = await fetchOptions(debounceSearchText);
          setOptions(response);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }

      if (debounceSearchText || !freeSolo) {
        getData();
      }
    }, [fetchOptions, debounceSearchText, freeSolo]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        setSearchText('');
        setOptions([]);
        console.log('clear', searchText, options);
      },
    }));

    return <Autocomplete {...defaultAutocompleteProps} />;
  },
);

export default AsyncAutocomplete;
