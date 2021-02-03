import React, { useEffect, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { Chip, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

import Table, { TableColumn } from '../../components/Table';
import { CastMemberType } from './Form';
import CastMemberApi from '../../services/CastMemberApi';

type castMemberTypeInterface = {
  [key: string]: string;
};

const castMemberType: castMemberTypeInterface = {
  '1': 'Diretor',
  '2': 'Ator',
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
    width: '33%',
  },
  {
    name: 'type',
    label: 'Tipo',
    options: {
      customBodyRender(value) {
        return <Chip label={castMemberType[value]} color="primary" />;
      },
    },
    width: '10%',
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
    padding: '0 16px',
    options: {
      sort: false,
      customBodyRender(_, tableMeta) {
        return (
          <IconButton
            color="secondary"
            component={Link}
            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        );
      },
    },
  },
];

const CastMemberTable: React.FC = () => {
  const [data, setData] = useState<CastMemberType[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function getData(): Promise<void> {
      setLoading(true);
      try {
        const response = await CastMemberApi.list<{ data: CastMemberType[] }>();
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
      title="Listagem de Membros de Elenco"
      columns={columsDefinition}
      data={data}
      loading={loading}
    />
  );
};

export default CastMemberTable;
