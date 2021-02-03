import HttpResource from './HttpResource';
import httpVideo from './api';
// import { CastMemberType } from '../pages/CastMember/Form';

const CastMemberApi = new HttpResource(httpVideo, 'cast_members');

export default CastMemberApi;
