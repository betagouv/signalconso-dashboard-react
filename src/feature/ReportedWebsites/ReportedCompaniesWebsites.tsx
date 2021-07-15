import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from "../../core/helper/useCssUtils";
import {Icon, InputBase, MenuItem} from "@material-ui/core";
import {useToast} from "../../core/toast";
import {fromNullable} from "fp-ts/lib/Option";
import {Panel} from "../../shared/Panel";
import {Datatable} from "../../shared/Datatable/Datatable";
import {DebouncedInput} from "../../shared/DebouncedInput/DebouncedInput";
import {Txt} from "mui-extension/lib/Txt/Txt";
import {useReportedWebsiteWithCompanyContext} from "../../core/context/ReportedWebsitesContext";
import {WebsiteKind, WebsiteWithCompany} from "../../core/api";
import {Btn, IconBtn} from "mui-extension";
import {ScSelect} from "../../shared/Select/Select";


export const ReportedCompaniesWebsites = () => {
    const {m, formatDate} = useI18n()
    const _fetch = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
    const _remove = useReportedWebsiteWithCompanyContext().remove
    const cssUtils = useCssUtils()
    const {toastError} = useToast()


    const useAnchoredMenu = () => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
        const open = (event: any) => setAnchorEl(event.currentTarget)
        const close = () => setAnchorEl(null)
        return {open, close, element: anchorEl}
    }

    const websiteKindBtn = (status: WebsiteKind) => {
        let validatedValue =
            status === WebsiteKind.DEFAULT ?
                <><Icon className={cssUtils.colorSuccess}>check_circle</Icon>
                    <span> {m.validated} </span></> : m.validated

        return <Btn size="small" color="primary" variant="outlined">
            {validatedValue}
        </Btn>
    }

    useEffect(() => {
        _fetch.fetch()
    }, [])

    useEffect(() => {
        fromNullable(_fetch.error).map(toastError)
    }, [_fetch.error])


    useEffect(() => {
        _remove.fetch()
    }, [])

    useEffect(() => {
        fromNullable(_remove.error).map(toastError)
    }, [_remove.error])

    return (
        <Panel>
            <Datatable<WebsiteWithCompany>
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
                        <ScSelect small={true} fullWidth value={_fetch.filters.kind ?? ''}
                                  onChange={event => _fetch.updateFilters(prev => ({
                                      ...prev,
                                      kind: event.target.value as WebsiteKind
                                  }))}>
                            <MenuItem value="">&nbsp;</MenuItem>
                            {[WebsiteKind.PENDING, WebsiteKind.DEFAULT].map(kind =>
                                <MenuItem key={kind} value={kind}>
                                    {kind === WebsiteKind.PENDING ? <> {m.notValidated} </> : m.validated}
                                </MenuItem>
                            )}
                        </ScSelect>
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
                    {
                        head: m.status,
                        id: 'status',
                        row: _ => websiteKindBtn(_.kind)
                    },
                    {
                        id: 'actions',
                        stickyEnd: true,
                        row: _ => (
                            <IconBtn className={cssUtils.colorTxtHint} onClick={() => _remove.fetch()(_.id)}>
                                <Icon>delete</Icon>
                            </IconBtn>
                        )
                    },
                ]}/>
        </Panel>
    )
}