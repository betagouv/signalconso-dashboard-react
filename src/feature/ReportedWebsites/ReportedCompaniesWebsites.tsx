import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from "../../core/helper/useCssUtils";
import {InputBase} from "@material-ui/core";
import {useToast} from "../../core/toast";
import {fromNullable} from "fp-ts/lib/Option";
import {Panel} from "../../shared/Panel";
import {Datatable} from "../../shared/Datatable/Datatable";
import {DebouncedInput} from "../../shared/DebouncedInput/DebouncedInput";
import {Txt} from "mui-extension/lib/Txt/Txt";
import {useReportedWebsiteWithCompanyContext} from "../../core/context/ReportedWebsitesContext";
import {WebsiteWithCompany} from "../../core/api";


export const ReportedCompaniesWebsites = () => {
    const {m, formatDate} = useI18n()
    const _reportedCompanyWebsites = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
    const cssUtils = useCssUtils()
    const {toastError} = useToast()

    useEffect(() => {
        _reportedCompanyWebsites.fetch()
    }, [])

    useEffect(() => {
        fromNullable(_reportedCompanyWebsites.error).map(toastError)
    }, [_reportedCompanyWebsites.error])

    return (
        <Panel>
            <Datatable<WebsiteWithCompany>
                header={
                    <>
                        <DebouncedInput
                            debounce={400}
                            value={_reportedCompanyWebsites.filters.host ?? ''}
                            onChange={host => _reportedCompanyWebsites.updateFilters(prev => ({...prev, host: host}))}
                        >
                            {(value, onChange) =>
                                <InputBase
                                    value={value}
                                    placeholder={m.searchByHost + '...'} fullWidth className={cssUtils.marginLeft}
                                    onChange={e => onChange(e.target.value)}
                                />
                            }
                        </DebouncedInput>
                    </>
                }
                loading={_reportedCompanyWebsites.fetching}
                total={_reportedCompanyWebsites.list?.totalSize}
                paginate={{
                    limit: _reportedCompanyWebsites.filters.limit,
                    offset: _reportedCompanyWebsites.filters.offset,
                    onPaginationChange: pagination => _reportedCompanyWebsites.updateFilters(prev => ({...prev, ...pagination})),
                }}
                getRenderRowKey={_ => _.host}
                data={_reportedCompanyWebsites.list?.data}
                rows={[
                    {
                        id: 'host',
                        head: m.website,
                        row: _ => <Txt bold>{_.host}</Txt>
                    },
                    {
                        head: m.reports,
                        id: 'reports',
                        row: _ => _.count
                    },
                    {
                        head: m.creationDate,
                        id: 'creationDate',
                        row: _ =>
                            <>{formatDate(_.creationDate)}</>
                    },
                    {
                        head: m.company,
                        id: 'company_name',
                        row: _ => _.company.name
                    },
                    {
                        head: m.siret,
                        id: 'company_siret',
                        row: _ => _.company.siret
                    },
                    // {
                    //     id: 'status',
                    //     head: m.status, row: _ =>
                    //         <ReportStatusChip dense status={_.kind}/>
                    // }
                ]}/>
        </Panel>
    )
}