import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import httpVideo from '../../services/api';
import { BadgeNo, BadgeYes } from '../../components/Navbar/Badge';

import { CategoryType } from './Form';

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
  const [data, setData] = useState<CategoryType[]>([]);

  useEffect(() => {
    let isCancelled = false;
    httpVideo.get<{ data: CategoryType[] }>('/categories').then(response => {
      if (!isCancelled) {
        setData(response.data.data);
      }
    });

    return () => {
      isCancelled = true;
    };
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
