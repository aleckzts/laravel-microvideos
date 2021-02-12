import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteProps as _AutocompleteProps,
} from '@material-ui/lab';
import {
  CircularProgress,
  TextField,
  TextFieldProps as _TextFieldProps,
} from '@material-ui/core';

interface AsyncAutocompleteProps {
  fetchOptions: (searchText: any) => Promise<any[]>;
  TextFieldProps?: _TextFieldProps;
  AutocompleteProps?: Omit<
    Omit<_AutocompleteProps<string, true, true, true>, 'renderInput'>,
    'options'
  >;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = ({
  fetchOptions,
  TextFieldProps,
  AutocompleteProps,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>();
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
    loading,
    loadingText: 'Carregando...',
    ...AutocompleteProps,
    freeSolo: true,
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
      setSearchText(value);
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
        const response = await fetchOptions(searchText);
        setOptions(response);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    if (searchText) {
      getData();
    }
  }, [fetchOptions, searchText]);

  return <Autocomplete {...defaultAutocompleteProps} />;
};

export default AsyncAutocomplete;
