import {Id, PaginatedData, Website,} from '../../model'
import {ApiClientApi} from '../..'
import {ReportNotificationBlockList, ReportNotificationBlockListSearch} from "./ReportNotificationBlocklist";


export class SettingsClient {

    constructor(private client: ApiClientApi) {
    }

    readonly list = (filters: ReportNotificationBlockListSearch): Promise<PaginatedData<ReportNotificationBlockList>> => {
        return Promise.resolve({
            'totalCount': 1,
            'hasNextPage': false,
            'entities': [{
                'company': {
                    'id': '29b2a1db-a19d-4d14-9561-611fefd740ee',
                    'siret': '81352117600038',
                    'creationDate': '2021-06-29T10:56:23.346359Z',
                    'name': 'Carrefour',
                    'address': {
                        'number': '31',
                        'street': 'RUE EMILE BERNARD',
                        'postalCode': '29930',
                        'city': 'PONT-AVEN',
                        'country': 'France'
                    }
                    ,
                    'activityCode': '46.41Z'
                }, 'active': false

            },
                {
                    'company': {
                        'id': '30b2a1db-a19d-4d14-9561-611fefd740ee',
                        'siret': '51352117600038',
                        'creationDate': '2021-07-29T10:56:23.346359Z',
                        'name': 'Amazon SARL',
                        'address': {
                            'number': '70',
                            'street': 'AVENUE PARAPLUIE',
                            'postalCode': '67930',
                            'city': 'PARIS',
                            'country': 'France'
                        }
                        ,
                        'activityCode': '46.41Z'
                    }, 'active': true

                }]
        } as unknown as PaginatedData<ReportNotificationBlockList>)
    }


    readonly create = (companyIds: Id[]): Promise<ReportNotificationBlockList> => {
        return this.client.post<ReportNotificationBlockList>(`/notifications`, {body: companyIds})
    }

    readonly remove = (companyIds: Id[]): Promise<void> => {
        return this.client.delete<void>(`/notifications`, {body: companyIds})
    }
}
