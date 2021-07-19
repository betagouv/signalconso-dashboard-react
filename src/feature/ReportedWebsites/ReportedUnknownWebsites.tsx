import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from "../../core/helper/useCssUtils";
import {InputBase, makeStyles, Theme} from "@material-ui/core";
import {Panel} from "../../shared/Panel";
import {Datatable} from "../../shared/Datatable/Datatable";
import {ApiHostWithReportCount} from "../../core/api";
import {DebouncedInput} from "../../shared/DebouncedInput/DebouncedInput";
import {Txt} from "mui-extension/lib/Txt/Txt";
import {useUnregistredWebsiteWithCompanyContext} from "../../core/context/UnregistredWebsitesContext";
import {useToast} from "../../core/toast";
import {fromNullable} from "fp-ts/lib/Option";
import {Datepicker} from "../../shared/Datepicker/Datepicker";
import {addDays, subDays} from "date-fns";
import {NavLink} from "react-router-dom";
import {siteMap} from "../../core/siteMap";
import {Btn} from "mui-extension";


const useStyles = makeStyles((t: Theme) => ({}))

export const ReportedUnknownWebsites = () => {

    const {m, formatDate} = useI18n()
    const _fetch = useUnregistredWebsiteWithCompanyContext().listUnregistred
    const cssUtils = useCssUtils()
    const {toastError, toastSuccess} = useToast()


    useEffect(() => {
        _fetch.fetch()
    }, [])

    useEffect(() => {
        fromNullable(_fetch.error).map(toastError)
    }, [_fetch.error])


    return (
        <Panel>
            <Datatable<ApiHostWithReportCount>
                header={
                    <>
                        <DebouncedInput
                            debounce={400}
                            value={_fetch.filters.host ?? ''}
                            onChange={host => _fetch.updateFilters(prev => ({...prev, host: host}))}
                        >
                            {(value, onChange) =>
                                <InputBase
                                    value={value}
                                    placeholder={m.searchByHost + '...'} fullWidth className={cssUtils.marginLeft}
                                    onChange={e => onChange(e.target.value)}
                                />
                            }
                        </DebouncedInput>
                        <Datepicker
                            className={cssUtils.marginRight}
                            fullWidth
                            label={m.start}
                            value={_fetch.filters.begin}
                            onChange={begin => {
                                _fetch.updateFilters(prev => {
                                    if (prev.end && begin.getTime() > prev.end.getTime()) {
                                        return {...prev, begin, end: addDays(begin, 1)}
                                    }
                                    return {...prev, begin}
                                })
                            }}
                        />
                        <Datepicker
                            fullWidth
                            value={_fetch.filters.end}
                            onChange={end =>
                                _fetch.updateFilters(prev => {
                                    if (prev.begin && prev.begin.getTime() > end.getTime()) {
                                        return {...prev, start: subDays(end, 1), end}
                                    }
                                    return {...prev, end}
                                })}
                            label={m.end}
                        />
                    </>
                }
                loading={_fetch.fetching}
                total={_fetch.list?.totalSize}
                paginate={{
                    limit: _fetch.filters.limit,
                    offset: _fetch.filters.offset,
                    onPaginationChange: pagination => _fetch.updateFilters(prev => ({...prev, ...pagination})),
                }}
                getRenderRowKey={_ => _.host}
                data={_fetch.list?.data}
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
                        id: 'actions',
                        row: _ => (
                            <>
                                <NavLink to={siteMap.reports({
                                    websiteURL: _.host
                                })}>
                                    <Btn size="small" color="primary" variant="outlined">
                                        {m.see}
                                    </Btn>
                                </NavLink>
                            </>
                        )
                    }
                ]}/>
        </Panel>
    )

}
