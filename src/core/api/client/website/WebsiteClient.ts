import {
    ApiHostWithReportCount,
    Id,
    Website,
    WebsiteKind,
    WebsiteUpdateCompany,
    WebsiteWithCompany,
    WebsiteWithCompanySearch
} from '../../model'
import {ApiClientApi} from '../..'
import {fromNullable} from "fp-ts/lib/Option";
import {paginateData} from "../../../helper/utils";
import {Paginate} from "@alexandreannic/react-hooks-lib";

export class WebsiteClient {

    constructor(private client: ApiClientApi) {
    }

    readonly list = (filters: WebsiteWithCompanySearch): Promise<Paginate<WebsiteWithCompany>> => {
        return this.client.get<WebsiteWithCompany[]>(`/websites`)
            .then(websiteWithCompany => websiteWithCompany.filter(website => website.kind != WebsiteKind.MARKETPLACE))
            .then(websiteWithCompany => fromNullable(filters.host).map(_ => _ === '' ? websiteWithCompany : websiteWithCompany.filter(website => website.host.indexOf(_) > 0)).getOrElse(websiteWithCompany))
            .then(websiteWithCompany => fromNullable(filters.kind).map(kindFiltered => websiteWithCompany.filter(website => website.kind === kindFiltered)).getOrElse(websiteWithCompany))
            .then(paginateData(filters.limit, filters.offset))
            .then(result => {
                result.data = result.data.map(_ => {
                    _.creationDate = new Date(_.creationDate)
                    return _
                })
                return result
            });
    };

    readonly listUnregistered = (q?: string, start?: string, end?: string): Promise<ApiHostWithReportCount[]> => {
        return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered`, {qs: {q, start, end}});
    };

    readonly extractUnregistered = (q?: string, start?: string, end?: string): Promise<ApiHostWithReportCount[]> => {
        return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered/extract`, {qs: {q, start, end}});
    };

    readonly update = (id: Id, website: Partial<Website>): Promise<WebsiteWithCompany> => {
        return this.client.put<WebsiteWithCompany>(`/websites/${id}`, {body: website})
    };

    readonly updateCompany = (id: Id, website: WebsiteUpdateCompany): Promise<WebsiteWithCompany> => {
        return this.client.put<WebsiteWithCompany>(`/websites/${id}/company`, {body: website})
    }

    readonly remove = (id: Id): Promise<void> => {
        return this.client.delete<void>(`/websites/${id}`)
    }

    readonly search = () => {
        return this.client.get<any>(`/websites/search`)
    }
}
