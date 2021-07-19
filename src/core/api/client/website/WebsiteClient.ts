import {
    ApiHostWithReportCount, HostReportCountSearch,
    Id, ReportSearch,
    Website,
    WebsiteKind,
    WebsiteUpdateCompany,
    WebsiteWithCompany,
    WebsiteWithCompanySearch
} from '../../model'
import {ApiClientApi, dateToApi, toQueryString} from '../..'
import {fromNullable} from "fp-ts/lib/Option";
import {paginateData} from "../../../helper/utils";
import {Paginate} from "@alexandreannic/react-hooks-lib";
import {ApiSdkLogger} from "../../helper/Logger";


export interface HostReportCountQueryString {
    host?: string;
    start?: string;
    end?: string;
    offset?: string;
    limit?: string;
}

const hostReportFilter2QueryString = (hostReport: HostReportCountSearch): HostReportCountQueryString => {
    try {
        const {host, begin, end, offset, limit, ...r} = hostReport
        const parseDate = (_: keyof Pick<HostReportCountSearch, 'begin' | 'end'>) => ((hostReport[_]) ? {[_]: dateToApi(hostReport[_])} : {})

        return {
            ...r,
            host,
            ...parseDate('begin'),
            ...parseDate('end'),
            offset: offset !== undefined ? offset + '' : undefined,
            limit: limit !== undefined ? limit + '' : undefined,
        }
    } catch (e) {
        ApiSdkLogger.error('Caught error on "hostReportFilter2QueryString"', hostReport, e)
        return {}
    }
}

export class WebsiteClient {

    constructor(private client: ApiClientApi) {
    }

    readonly list = (filters: WebsiteWithCompanySearch): Promise<Paginate<WebsiteWithCompany>> => {
        return this.client.get<WebsiteWithCompany[]>(`/websites`)
            .then(websiteWithCompany => websiteWithCompany.filter(website => website.kind != WebsiteKind.MARKETPLACE))
            .then(websiteWithCompany => fromNullable(filters.host).map(_ => _ === '' ? websiteWithCompany : websiteWithCompany.filter(website => website.host.includes(_))).getOrElse(websiteWithCompany))
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

    readonly listUnregistered = (filters: HostReportCountSearch): Promise<Paginate<ApiHostWithReportCount>> => {
        return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered${toQueryString(hostReportFilter2QueryString(filters))}`)
            .then(hostWithReport => fromNullable(filters.host).map(_ => _ === '' ? hostWithReport : hostWithReport.filter(w => w.host.includes(_))).getOrElse(hostWithReport))
            .then(paginateData(filters.limit, filters.offset));
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
