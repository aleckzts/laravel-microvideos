import { CategoryType } from '../pages/Category/Form';
import { GenreType } from '../pages/Genre/Form';

const getGenresFromCategory = (
  genres: GenreType[],
  category: CategoryType,
): GenreType[] => {
  return genres
    ? genres.filter(genre =>
        genre.categories
          ? genre.categories.filter(cat => cat.id === category.id).length !== 0
          : null,
      )
    : [];
};

export default getGenresFromCategory;
