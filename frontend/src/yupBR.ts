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
  array: {
    min: '${path} precisa de pelo menos um item',
  },
});

export default yup;
