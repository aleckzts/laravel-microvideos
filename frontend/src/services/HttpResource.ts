import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpResource {
  constructor(protected http: AxiosInstance, protected resource: string) {}

  list<T>(options?: { queryParams?: any }): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {};
    if (options && options.queryParams) {
      config.params = options.queryParams;
    }
    return this.http.get<T>(this.resource, config);
  }

  get<T>(id: string): Promise<AxiosResponse<T>> {
    return this.http.get<T>(`${this.resource}/${id}`);
  }

  create<T>(data: T): Promise<AxiosResponse<T>> {
    return this.http.post<T>(this.resource, data);
  }

  update<T>(id: string, data: T): Promise<AxiosResponse<T>> {
    return this.http.put<T>(`${this.resource}/${id}`, data);
  }

  delete<T>(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(`${this.resource}/${id}`);
  }
}

export default HttpResource;
