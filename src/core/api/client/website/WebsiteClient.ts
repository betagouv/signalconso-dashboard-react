import {ApiHostWithReportCount, Id, Website, WebsiteUpdateCompany, WebsiteWithCompany} from '../../model'
import {ApiClientApi} from '../../index'

export class WebsiteClient {

  constructor(private client: ApiClientApi) {
  }

  readonly list = (): Promise<WebsiteWithCompany[]> => {
    return this.client.get<WebsiteWithCompany[]>(`/websites`);
  };

  readonly listUnregistered = (q?: string, start?: string, end?: string): Promise<ApiHostWithReportCount[]> => {
    return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered`, {qs: {q, start, end}});
  };

  readonly extractUnregistered = (q?: string, start?: string, end?: string): Promise<ApiHostWithReportCount[]> => {
    return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered/extract`, {qs: {q, start, end}});
  };

  readonly update = (id: Id, website: Partial<Website>): Promise<WebsiteWithCompany> => {
    return this.client.put<WebsiteWithCompany>(`/websites/${id}`, {body: website});
  };

  readonly updateCompany = (id: Id, website: WebsiteUpdateCompany): Promise<WebsiteWithCompany> => {
    return this.client.put<WebsiteWithCompany>(`/websites/${id}/company`, {body: website});
  };

  readonly remove = (id: Id): Promise<void> => {
    return this.client.delete<void>(`/websites/${id}`);
  };
}
