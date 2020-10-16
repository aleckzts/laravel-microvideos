import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { Chip } from '@material-ui/core';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import httpVideo from '../../services/api';

type castMemberTypeInterface = {
  [key: string]: string;
};

const castMemberType: castMemberTypeInterface = {
  '1': 'Diretor',
  '2': 'Ator',
};

const columsDefinition: MUIDataTableColumn[] = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'type',
    label: 'Tipo',
    options: {
      customBodyRender(value) {
        return <Chip label={castMemberType[value]} color="primary" />;
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

const CastMemberTable: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    httpVideo('/cast_members').then(response => {
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

export default CastMemberTable;
