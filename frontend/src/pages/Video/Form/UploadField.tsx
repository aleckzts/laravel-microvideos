import React, {
  MutableRefObject,
  RefAttributes,
  useImperativeHandle,
  useRef,
} from 'react';
import { Button, FormControl, FormHelperText } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InputFile, { InputFileComponent } from '../../../components/InputFile';

interface UploadFieldProps extends RefAttributes<UploadFieldComponent> {
  accept: string;
  label: string;
  setValue: (value: File) => void;
  disabled: boolean;
  error?: any;
}

interface UploadFieldComponent {
  clear: () => void;
}

const UploadField = React.forwardRef<UploadFieldComponent, UploadFieldProps>(
  ({ accept, label, setValue, disabled, error }, ref) => {
    // const UploadField: React.FC<UploadFieldProps> = ({
    //   accept,
    //   label,
    //   setValue,
    //   disabled,
    //   error,
    // }) => {
    const fileRef = useRef() as MutableRefObject<InputFileComponent>;

    useImperativeHandle(ref, () => ({
      clear: () => fileRef.current.clear(),
    }));

    return (
      <FormControl
        margin="normal"
        fullWidth
        disabled={disabled}
        error={error !== undefined}
      >
        <InputFile
          ref={fileRef}
          TextFieldProps={{
            label,
            InputLabelProps: { shrink: true },
            style: { backgroundColor: '#ffffff' },
          }}
          InputFileProps={{
            accept,
            onChange(event) {
              event.target.files?.length && setValue(event.target.files[0]);
            },
          }}
          ButtonFile={
            <Button
              endIcon={<CloudUploadIcon />}
              variant="contained"
              color="primary"
              onClick={() => fileRef.current.openWindow()}
            >
              Adicionar
            </Button>
          }
        />

        {error && (
          <FormHelperText id="type-helper-text">{error.message}</FormHelperText>
        )}
      </FormControl>
    );
  },
);

export default UploadField;
