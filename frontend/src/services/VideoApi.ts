import HttpResource from './HttpResource';
import httpVideo from './api';
import { VideoType } from '../pages/Video/Form';

const VideoApi = new HttpResource<VideoType>(httpVideo, 'videos');

export default VideoApi;
