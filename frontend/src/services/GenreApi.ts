import HttpResource from './HttpResource';
import httpVideo from './api';
// import { GenreType } from '../pages/Genre/Form';

const GenreApi = new HttpResource(httpVideo, 'genres');

export default GenreApi;
