import React, {
  MutableRefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  InputAdornment,
  TextField,
  TextFieldProps as TextFieldPropsType,
} from '@material-ui/core';

export interface InputFileComponent {
  openWindow: () => void;
}

interface InputFileProps {
  ButtonFile: React.ReactNode;
  InputFileProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  TextFieldProps?: TextFieldPropsType;
}

const InputFile = React.forwardRef<InputFileComponent, InputFileProps>(
  ({ ButtonFile, InputFileProps, TextFieldProps }, ref) => {
    const fileRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [filename, setFilename] = useState('');

    const defaultTextFieldProps: TextFieldPropsType = {
      variant: 'outlined',
      ...TextFieldProps,
      InputProps: {
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">{ButtonFile}</InputAdornment>
        ),
      },
      value: filename,
    };

    const defaultInputFileProps: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > = {
      ...InputFileProps,
      hidden: true,
      onChange(event) {
        const { files } = event.target;
        if (files && files.length) {
          setFilename(
            Array.from(files)
              .map(file => file.name)
              .join(''),
          );
        }
        if (InputFileProps && InputFileProps.onChange) {
          InputFileProps.onChange(event);
        }
      },
    };

    useImperativeHandle(ref, () => ({
      openWindow: () => fileRef.current.click(),
    }));

    return (
      <>
        <input type="file" ref={fileRef} {...defaultInputFileProps} />
        <TextField {...defaultTextFieldProps} />
      </>
    );
  },
);

export default InputFile;
