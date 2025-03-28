import { dateToApiTime } from '../../helper'
import {
  ApiHostWithReportCount,
  Country,
  HostReportCountSearch,
  Id,
  IdentificationStatus,
  InvestigationStatus,
  Paginate,
  PaginatedData,
  Website,
  WebsiteCreation,
  WebsiteInvestigation,
  WebsiteUpdateCompany,
  WebsiteWithCompany,
  WebsiteWithCompanyAndCount,
  WebsiteWithCompanySearch,
} from '../../model'
import { ApiClient } from '../ApiClient'

interface HostReportCountQueryString {
  q?: string
  start?: string
  end?: string
  offset?: string
  limit?: string
}

const hostReportFilter2QueryString = (
  hostReport: HostReportCountSearch,
): HostReportCountQueryString => {
  try {
    const { q, start, end, offset, limit, ...r } = hostReport
    const parseDate = (
      _: keyof Pick<HostReportCountSearch, 'start' | 'end'>,
    ) => (hostReport[_] ? { [_]: dateToApiTime(hostReport[_]) } : {})

    return {
      ...r,
      q: q,
      ...parseDate('start'),
      ...parseDate('end'),
      offset: offset !== undefined ? offset + '' : undefined,
      limit: limit !== undefined ? limit + '' : undefined,
    }
  } catch (e) {
    console.error(
      'Caught error on "hostReportFilter2QueryString"',
      hostReport,
      e,
    )
    return {}
  }
}

const cleanFilter = (
  filter: WebsiteWithCompanySearch,
): WebsiteWithCompanySearch => {
  if (filter.host === '') {
    delete filter.host
  }
  return filter
}

export class WebsiteClient {
  constructor(private client: ApiClient) {}

  readonly list = (filters: WebsiteWithCompanySearch) => {
    return this.client
      .get<PaginatedData<WebsiteWithCompanyAndCount>>(`/websites`, {
        qs: cleanFilter(filters),
      })
      .then((paginated) =>
        Object.assign({}, paginated, { entities: paginated.entities }),
      )
      .then((result) => {
        result.entities = result.entities.map((_) => {
          _.creationDate = new Date(_.creationDate)
          _.lastUpdated = _.lastUpdated ? new Date(_.lastUpdated) : undefined
          return _
        })
        return result
      })
  }

  readonly listInvestigationStatus = () => {
    return this.client.get<InvestigationStatus[]>(
      `resources/investigation-status`,
    )
  }

  readonly createOrUpdateInvestigation = (
    websiteInvestigation: WebsiteInvestigation,
  ): Promise<WebsiteInvestigation> => {
    return this.client.post<WebsiteInvestigation>(`/website-investigations`, {
      body: websiteInvestigation,
    })
  }

  readonly listUnregistered = (
    filters: HostReportCountSearch,
  ): Promise<Paginate<ApiHostWithReportCount>> => {
    return this.client.get<PaginatedData<ApiHostWithReportCount>>(
      `/websites/unregistered`,
      {
        qs: hostReportFilter2QueryString(filters),
      },
    )
  }

  readonly extractUnregistered = (filters: HostReportCountSearch) => {
    return this.client.get<void>(`/websites/unregistered/extract`, {
      qs: hostReportFilter2QueryString(filters),
    })
  }

  readonly updateStatus = (
    id: Id,
    identificationStatus: IdentificationStatus,
  ): Promise<WebsiteWithCompany> => {
    return this.client.put<WebsiteWithCompany>(`/websites/${id}`, {
      qs: { identificationStatus: identificationStatus },
    })
  }

  readonly updateCompany = (
    id: Id,
    website: WebsiteUpdateCompany,
  ): Promise<WebsiteWithCompany> => {
    return this.client.put<WebsiteWithCompany>(`/websites/${id}/company`, {
      body: website,
    })
  }

  readonly updateCountry = (
    id: Id,
    country: Country,
  ): Promise<WebsiteWithCompany> => {
    return this.client.put<WebsiteWithCompany>(`/websites/${id}/country`, {
      qs: { companyCountry: country.code },
    })
  }

  readonly remove = (id: Id): Promise<void> => {
    return this.client.delete<void>(`/websites/${id}`)
  }

  readonly search = () => {
    return this.client.get<any>(`/websites/search`)
  }

  readonly create = (websiteCreation: WebsiteCreation) => {
    return this.client.post<Website>(`/websites`, { body: websiteCreation })
  }

  readonly updateMarketplace = (
    id: Id,
    isMarketPlace: boolean,
  ): Promise<WebsiteWithCompany> => {
    return this.client.put<WebsiteWithCompany>(`/websites/${id}`, {
      qs: { isMarketPlace: isMarketPlace },
    })
  }
}
