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
import CastMemberApi from '../../../services/CastMemberApi';

interface CastMemberFieldProps extends RefAttributes<CastMemberFieldComponent> {
  castMembers: any[];
  setCastMembers: (value: any[]) => void;
  error: any;
  disabled?: boolean;
}

export interface CastMemberFieldComponent {
  clear: () => void;
}

const CastMemberField = React.forwardRef<
  CastMemberFieldComponent,
  CastMemberFieldProps
>(({ castMembers, setCastMembers, error, disabled }, ref) => {
  const autocompleteRef = useRef() as MutableRefObject<
    AsyncAutocompleteComponent
  >;
  // const CastMemberField: React.FC<CastMemberFieldProps> = ({
  //   castMembers,
  //   setCastMembers,
  //   error,
  //   disabled,
  // }) => {
  const autocompleteHttp = useHttpHandled();
  const { addItem, removeItem } = useCollectionManager(
    castMembers,
    setCastMembers,
  );

  const fetchOptions = async (searchText: string): Promise<any> =>
    autocompleteHttp(
      CastMemberApi.list({
        queryParams: {
          search: searchText,
          all: '',
        },
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
        TextFieldProps={{
          label: 'Membros de elenco',
          error: error !== undefined,
        }}
        AutocompleteProps={{
          fullWidth: true,
          getOptionLabel: (option: any) => option.name,
          onChange: (event, value) => addItem(value),
          freeSolo: true,
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
          {castMembers.map(castMember => (
            <GridSelectedItem
              key={castMember.id}
              onClick={() => removeItem(castMember)}
              xs={6}
            >
              <Typography noWrap>{castMember.name}</Typography>
            </GridSelectedItem>
          ))}
        </GridSelected>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
});

export default CastMemberField;
