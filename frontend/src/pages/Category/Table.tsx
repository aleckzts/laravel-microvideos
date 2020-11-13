import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { Chip } from '@material-ui/core';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import httpVideo from '../../services/api';
import { BadgeNo, BadgeYes } from '../../components/Navbar/Badge';

const columsDefinition: MUIDataTableColumn[] = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'is_active',
    label: 'Ativo',
    options: {
      customBodyRender(value) {
        return value ? <BadgeYes /> : <BadgeNo />;
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

const CategoryTable: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    httpVideo.get('/categories').then(response => {
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

export default CategoryTable;
