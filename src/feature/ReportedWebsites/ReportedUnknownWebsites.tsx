import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from "../../core/helper/useCssUtils";
import {Icon, InputBase, makeStyles, Theme, Tooltip} from "@material-ui/core";
import {Panel} from "../../shared/Panel";
import {Datatable} from "../../shared/Datatable/Datatable";
import {ApiHostWithReportCount} from "../../core/api";
import {DebouncedInput} from "../../shared/DebouncedInput/DebouncedInput";
import {useUnregistredWebsiteWithCompanyContext} from "../../core/context/UnregistredWebsitesContext";
import {useToast} from "../../core/toast";
import {fromNullable} from "fp-ts/lib/Option";
import {Datepicker} from "../../shared/Datepicker/Datepicker";
import {addDays, subDays} from "date-fns";
import {NavLink} from "react-router-dom";
import {siteMap} from "../../core/siteMap";
import {Btn, IconBtn} from "mui-extension";
import {ExportUnknownWebsitesPopper} from "../../shared/ExportPopper/ExportPopperBtn";


const useStyles = makeStyles((t: Theme) => ({}))

export const ReportedUnknownWebsites = () => {

    const {m} = useI18n()
    const _fetch = useUnregistredWebsiteWithCompanyContext()
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
                            value={_fetch.filters.q ?? ''}
                            onChange={q => _fetch.updateFilters(prev => ({...prev, q: q}))}
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
                            value={_fetch.filters.start}
                            onChange={start => {
                                _fetch.updateFilters(prev => {
                                    if (prev.end && start.getTime() > prev.end.getTime()) {
                                        return {...prev, start: start, end: addDays(start, 1)}
                                    }
                                    return {...prev, start: start}
                                })
                            }}
                        />
                        <Datepicker
                            fullWidth
                            value={_fetch.filters.end}
                            onChange={end =>
                                _fetch.updateFilters(prev => {
                                    if (prev.start && prev.start.getTime() > end.getTime()) {
                                        return {...prev, start: subDays(end, 1), end}
                                    }
                                    return {...prev, end}
                                })}
                            label={m.end}
                        />
                        <Tooltip title={m.removeAllFilters}>
                            <IconBtn color="primary" onClick={_fetch.clearFilters}>
                                <Icon>clear</Icon>
                            </IconBtn>
                        </Tooltip>
                        <ExportUnknownWebsitesPopper/>
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
                showColumnsToggle={true}
                rows={[
                    {
                        id: 'host',
                        head: m.website,
                        row: _ => <a href={"https://" + _.host}>{_.host}</a>
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
