import { CategoryType } from '../pages/Category/Form';
import { GenreType } from '../pages/Genre/Form';

const getGenresFromCategory = (
  genres: GenreType[],
  category: CategoryType,
): GenreType[] => {
  return genres.filter(
    genre =>
      genre.categories.filter(cat => cat.id === category.id).length !== 0,
  );
};

export default getGenresFromCategory;
