import {
    ApiHostWithReportCount, HostReportCountSearch,
    Id, PaginatedData, ReportSearch,
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
    q?: string;
    start?: string;
    end?: string;
    offset?: string;
    limit?: string;
}

const hostReportFilter2QueryString = (hostReport: HostReportCountSearch): HostReportCountQueryString => {
    try {
        const {q, start, end, offset, limit, ...r} = hostReport
        const parseDate = (_: keyof Pick<HostReportCountSearch, 'start' | 'end'>) => ((hostReport[_]) ? {[_]: dateToApi(hostReport[_])} : {})

        return {
            ...r,
            q: q,
            ...parseDate('start'),
            ...parseDate('end'),
            offset: offset !== undefined ? offset + '' : undefined,
            limit: limit !== undefined ? limit + '' : undefined,
        }
    } catch (e) {
        ApiSdkLogger.error('Caught error on "hostReportFilter2QueryString"', hostReport, e)
        return {}
    }
}


const cleanFilter = (filter: WebsiteWithCompanySearch): WebsiteWithCompanySearch => {
    if (filter.kinds === []) {
        delete filter.kinds
    }
    if (filter.host === '') {
        delete filter.host
    }
    return filter
}


export class WebsiteClient {

    constructor(private client: ApiClientApi) {
    }

    readonly list = (filters: WebsiteWithCompanySearch) => {
        return this.client.get<PaginatedData<WebsiteWithCompany>>(`/websites${toQueryString(cleanFilter(filters))}`)
            .then(paginated =>
                Object.assign({}, paginated, {entities: paginated.entities.filter(website => website.kind !== WebsiteKind.MARKETPLACE)})
            )
            .then(result => {
                result.entities = result.entities.map(_ => {
                    _.creationDate = new Date(_.creationDate)
                    return _
                })
                return result
            });
    };


    readonly listUnregistered = (filters: HostReportCountSearch): Promise<Paginate<ApiHostWithReportCount>> => {
        return this.client.get<ApiHostWithReportCount[]>(`/websites/unregistered${toQueryString(hostReportFilter2QueryString(filters))}`)
            .then(paginateData(filters.limit, filters.offset));
    };


    readonly extractUnregistered = (filters: HostReportCountSearch) => {
        return this.client.get<void>(`/websites/unregistered/extract`, {qs: hostReportFilter2QueryString(filters)})
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
