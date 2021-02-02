import React, { useEffect, useState } from 'react';
import { Chip } from '@material-ui/core';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import httpVideo from '../../services/api';

import { GenreType } from './Form';
import Table, { TableColumn } from '../../components/Table';

type categoryInterface = {
  name: string;
};

const columsDefinition: TableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    width: '30%',
  },
  {
    name: 'name',
    label: 'Nome',
    width: '43%',
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
    width: '20%',
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
    width: '4%',
  },
  {
    name: 'created_at',
    label: 'Criado em',
    options: {
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
    width: '10%',
  },
  {
    name: 'actions',
    label: 'Ações',
    width: '13%',
  },
];

const GenreTable: React.FC = () => {
  const [data, setData] = useState<GenreType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await httpVideo.get<{ data: GenreType[] }>('/genres');
        if (!isCancelled) {
          setData(response.data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getData();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <Table
      title="Listagem de Gêneros"
      columns={columsDefinition}
      data={data}
      loading={loading}
    />
  );
};

export default GenreTable;
