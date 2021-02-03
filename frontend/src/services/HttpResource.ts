import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

class HttpResource<T> {
  private cancelList: CancelTokenSource | null = null;

  constructor(protected http: AxiosInstance, protected resource: string) {}

  list(options?: { queryParams?: any }): Promise<AxiosResponse<{ data: T[] }>> {
    if (this.cancelList) {
      this.cancelList.cancel('list request canceled');
    }

    this.cancelList = axios.CancelToken.source();

    const config: AxiosRequestConfig = {
      cancelToken: this.cancelList.token,
    };
    if (options && options.queryParams) {
      config.params = options.queryParams;
    }
    return this.http.get<{ data: T[] }>(this.resource, config);
  }

  get(id: string): Promise<AxiosResponse<{ data: T }>> {
    return this.http.get<{ data: T }>(`${this.resource}/${id}`);
  }

  create(data: T): Promise<AxiosResponse<{ data: T }>> {
    return this.http.post<{ data: T }>(this.resource, data);
  }

  update(id: string, data: T): Promise<AxiosResponse<{ data: T }>> {
    return this.http.put<{ data: T }>(`${this.resource}/${id}`, data);
  }

  delete(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(`${this.resource}/${id}`);
  }

  isRequestCancelled(error: any): boolean {
    return axios.isCancel(error);
  }
}

export default HttpResource;
