import { useSnackbar } from 'notistack';

const useCollectionManager = (
  collection: any[],
  setCollection: (item: any) => void,
): any => {
  const snackbar = useSnackbar();

  return {
    addItem(item: any) {
      if (item) {
        const exists = collection.find(value => value.id === item.id);
        if (exists) {
          snackbar.enqueueSnackbar('Item já adicionado', { variant: 'info' });
        } else {
          collection.unshift(item);
          setCollection(collection);
        }
      }
    },

    removeItem(item: any) {
      if (item) {
        const existsIndex = collection.findIndex(value => value.id === item.id);
        if (existsIndex >= 0) {
          collection.splice(existsIndex, 1);
          setCollection(collection);
        }
      }
    },
  };
};

export default useCollectionManager;
