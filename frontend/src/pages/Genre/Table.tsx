import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { Chip } from '@material-ui/core';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import httpVideo from '../../services/api';

type categoryInterface = {
  name: string;
};

const columsDefinition: MUIDataTableColumn[] = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'categories',
    label: 'Categorias',
    options: {
      customBodyRender(value: unknown) {
        const categories = value as Array<categoryInterface>;
        return (
          <span>{categories.map(category => category.name).join(', ')}</span>
        );
      },
    },
  },
  {
    name: 'is_active',
    label: 'Ativo',
    options: {
      customBodyRender(value) {
        return value ? (
          <Chip label="Sim" color="primary" />
        ) : (
          <Chip label="Não" color="secondary" />
        );
      },
    },
  },
  {
    name: 'created_at',
    label: 'Criado em',
    options: {
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
  },
];

const GenreTable: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    httpVideo('/genres').then(response => {
      // console.log(response.data.data);
      setData(response.data.data);
    });
  }, []);

  return (
    <MUIDataTable
      title="Listagem de Categorias"
      columns={columsDefinition}
      data={data}
    />
  );
};

export default GenreTable;
