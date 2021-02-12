import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import Rating, { RatingTypes } from '../../../components/Rating';

interface RatingFieldProps {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  error?: any;
}

const RatingField: React.FC<RatingFieldProps> = ({
  value,
  setValue,
  disabled,
  error,
}) => {
  const ratings: RatingTypes[] = ['L', '10', '12', '14', '16', '18'];

  return (
    <FormControl margin="none" disabled={disabled} error={error !== undefined}>
      <FormLabel component="legend" style={{ paddingBottom: '16px' }}>
        Classificação
      </FormLabel>
      <RadioGroup
        name="rating"
        value={value}
        row
        onChange={event => {
          setValue(event.target.value);
        }}
      >
        {ratings.map((rating, key) => (
          <FormControlLabel
            key={key}
            value={rating}
            control={<Radio color="primary" />}
            label={<Rating rating={rating} />}
            labelPlacement="top"
          />
        ))}
      </RadioGroup>
      {error && (
        <FormHelperText id="type-helper-text">{error.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export default RatingField;
