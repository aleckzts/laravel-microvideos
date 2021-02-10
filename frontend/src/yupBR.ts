import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: '${path} é requerido',
    noType: '${path} é inválido',
  },
  string: {
    max: '${path} precisa ter no máximo ${max} caracteres',
  },
  number: {
    min: '${path} precisa ser no mínimo ${min}',
  },
});

export default yup;
