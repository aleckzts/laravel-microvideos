import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { omit } from 'lodash';
import { serialize } from 'object-to-formdata';

interface MetaDataType {
  current_page: number;
  last_page: number;
  total: number;
}

class HttpResource<T> {
  private cancelList: CancelTokenSource | null = null;

  constructor(protected http: AxiosInstance, protected resource: string) {}

  private containsFile(data: T): boolean {
    return Object.values(data).filter(el => el instanceof File).length !== 0;
  }

  private getFormData(data: T): T {
    const serializedData = serialize<T>(data, {
      booleansAsIntegers: true,
    }) as unknown;
    return serializedData as T;
  }

  private makeSendData(data: T): T {
    return this.containsFile(data) ? this.getFormData(data) : data;
  }

  list(options?: {
    queryParams?: any;
  }): Promise<AxiosResponse<{ data: T[]; meta: MetaDataType }>> {
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
    return this.http.get<{ data: T[]; meta: MetaDataType }>(
      this.resource,
      config,
    );
  }

  get(id: string): Promise<AxiosResponse<{ data: T }>> {
    return this.http.get<{ data: T }>(`${this.resource}/${id}`);
  }

  create(data: T): Promise<AxiosResponse<{ data: T }>> {
    const sendData = this.makeSendData(data);
    return this.http.post<{ data: T }>(this.resource, sendData);
  }

  update(
    id: string,
    data: T & { _method: string },
    options?: any,
  ): Promise<AxiosResponse<{ data: T }>> {
    const sendData = this.containsFile(data) ? this.getFormData(data) : data;
    const { http } = options || {};
    return !options || !http || !http.usePost
      ? this.http.put<{ data: T }>(`${this.resource}/${id}`, sendData)
      : this.http.post<{ data: T }>(`${this.resource}/${id}`, sendData);
  }

  delete(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(`${this.resource}/${id}`);
  }

  isRequestCancelled(error: any): boolean {
    return axios.isCancel(error);
  }
}

export default HttpResource;
