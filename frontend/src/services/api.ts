import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const httpVideo = axios.create({
  baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL,
});

const instances = [httpVideo];

export function addGlobalRequestInterceptor(
  onFulFilled?: (
    value: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  onRejected?: (error: any) => any,
): number[] {
  const ids: number[] = [];
  // for (const i of instances) {
  instances.forEach(i => {
    const id = i.interceptors.request.use(onFulFilled, onRejected);
    ids.push(id);
  });
  // }
  return ids;
}

export function removeGlobalRequestIntercptor(ids: number[]): void {
  ids.forEach((id, index) => instances[index].interceptors.request.eject(id));
}

export function addGlobalResponseInterceptor(
  onFulFilled?: (
    value: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>,
  onRejected?: (error: any) => any,
): number[] {
  const ids: number[] = [];
  // for (const i of instances) {
  instances.forEach(i => {
    const id = i.interceptors.response.use(onFulFilled, onRejected);
    ids.push(id);
  });
  // }
  return ids;
}

export function removeGlobalResponseIntercptor(ids: number[]): void {
  ids.forEach((id, index) => instances[index].interceptors.response.eject(id));
}

export default httpVideo;
