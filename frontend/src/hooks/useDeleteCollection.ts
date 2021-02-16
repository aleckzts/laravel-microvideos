import { useEffect, useState } from 'react';

const useDeleteCollection = (): any => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<{
    data: Array<{ index: any; dataIndex: any }>;
  }>({ data: [] });

  useEffect(() => {
    if (rowsToDelete.data.length) {
      setOpenDeleteDialog(true);
    }
  }, [rowsToDelete]);

  return {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  };
};

export default useDeleteCollection;
