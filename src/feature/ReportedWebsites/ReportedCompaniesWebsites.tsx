import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Chip, FormControlLabel, Icon, InputBase, makeStyles, MenuItem, Switch, Theme, Tooltip} from '@material-ui/core'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {WebsiteKind, WebsiteWithCompany} from '../../core/api'
import {IconBtn} from 'mui-extension'
import {ScSelect} from '../../shared/Select/Select'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {Txt} from 'mui-extension/lib/Txt/Txt'


export const ReportedCompaniesWebsites = () => {

    const useStyles = makeStyles((t: Theme) => ({
        tdName_label: {
            fontWeight: 'bold',
            marginBottom: -1,
            maxWidth: 200,
        },
        tdName_desc: {
            fontSize: t.typography.fontSize * 0.875,
            color: t.palette.text.hint,
        },
        chipEnterprise: {
            height: 42,
            borderRadius: 42,
        },
    }))


    const {m, formatDate} = useI18n()
    const _fetch = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
    const _remove = useReportedWebsiteWithCompanyContext().remove
    const _update = useReportedWebsiteWithCompanyContext().update
    const _updateCompany = useReportedWebsiteWithCompanyContext().updateCompany
    const css = useStyles()
    const cssUtils = useCssUtils()
    const {toastError, toastInfo, toastSuccess} = useToast()

    useEffect(() => {
        _fetch.updateFilters({..._fetch.initialFilters})
    }, [])

    useEffect(() => {
        _fetch.fetch()
    }, [])

    useEffect(() => {
        fromNullable(_fetch.error).map(toastError)
    }, [_fetch.error])

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
                        <ScSelect multiple small fullWidth
                                  onChange={event =>
                                      _fetch.updateFilters(prev => ({
                                          ...prev,
                                          kinds: event.target.value as WebsiteKind[]
                                      }))
                                  }
                                  defaultValue={_fetch.filters.kinds ?? [WebsiteKind.PENDING]}
                        >
                            {[WebsiteKind.PENDING, WebsiteKind.DEFAULT].map(kind =>
                                <MenuItem key={kind} value={kind}>
                                    {kind === WebsiteKind.PENDING ? m.notValidated : m.validated}
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
                getRenderRowKey={_ => _.id}
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
                        head: m.creationDate,
                        id: 'creationDate',
                        row: _ =>
                            <>{formatDate(_.creationDate)}</>
                    },
                    {
                        head: m.company,
                        id: 'company_name',
                        row: _ => (
                            <SelectCompany siret={_.company.siret} onChange={company => {
                                if (_.company.siret === company.siret) {
                                    toastInfo(m.alreadySelectedCompany(company.name))
                                } else {
                                    _updateCompany.fetch({}, _.id, {
                                        companySiret: company.siret,
                                        companyName: company.name,
                                        companyAddress: company.address,
                                        companyActivityCode: company.activityCode,
                                    }).then(_ => _fetch.fetch())
                                }
                            }}>
                                <Tooltip title={_.company.name}>
                                    <Chip variant={'outlined'} className={css.chipEnterprise} label={<div>
                                        <Txt truncate className={css.tdName_label} block>{_.company.name}</Txt>
                                        <span className={css.tdName_desc}>{_.company.siret}</span>
                                    </div>
                                    }/>
                                </Tooltip>
                            </SelectCompany>

                        )
                    },
                    {
                        head: m.status,
                        id: 'status',
                        row: _ =>
                            (<FormControlLabel
                                control={<Switch checked={_.kind === WebsiteKind.DEFAULT}/>}
                                onChange={() => _update.fetch({}, _.id, {
                                    ..._,
                                    kind: _.kind === WebsiteKind.DEFAULT ? WebsiteKind.PENDING : WebsiteKind.DEFAULT
                                }).then(() => toastSuccess(m.statusEdited)).then(_ => _fetch.fetch())
                                }
                                label={_.kind === WebsiteKind.DEFAULT ? m.validated : m.notValidated}
                            />)
                    },
                    {
                        id: 'actions',
                        stickyEnd: true,
                        row: _ => (
                            <IconBtn className={cssUtils.colorTxtHint}
                                     onClick={() => _remove.fetch({}, _.id).then(_ => _fetch.fetch())}>
                                <Icon>delete</Icon>
                            </IconBtn>
                        )
                    },
                ]}/>
        </Panel>
    )
}
