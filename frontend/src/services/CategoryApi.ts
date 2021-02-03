import HttpResource from './HttpResource';
import httpVideo from './api';
import { CategoryType } from '../pages/Category/Form';

const CategoryApi = new HttpResource<CategoryType>(httpVideo, 'categories');

export default CategoryApi;
