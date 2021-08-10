import {ReportNotificationBlockList} from "../../core/api/client/settings/ReportNotificationBlocklist";
import {AddressComponent} from "../../shared/Address/Address";
import {styleUtils} from "../../core/theme";
import {useReportNotificationBlockListContext} from "../../core/context/ReportNotificationBlocklist";
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {FormControlLabel, makeStyles, Switch, Theme} from '@material-ui/core'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Page, PageTitle} from '../../shared/Layout'
import {ScButton} from "../../shared/Button/Button";

const useStyles = makeStyles((t: Theme) => ({
    tdName_label: {
        fontWeight: 'bold',
        marginBottom: -1,
    },
    tdName: {
        lineHeight: 1.4,
        maxWidth: 170,
    },
    tdName_desc: {
        fontSize: t.typography.fontSize * 0.875,
        color: t.palette.text.hint,
    },
    tdAddress: {
        maxWidth: 300,
        ...styleUtils(t).truncate,
    }
}))

export const ReportNotificationBlockListSettings = () => {
    const {m} = useI18n()
    const _fetch = useReportNotificationBlockListContext().getReportNotificationBlockList
    const _remove = useReportNotificationBlockListContext().remove
    const _create = useReportNotificationBlockListContext().create
    const cssUtils = useCssUtils()
    const {toastError, toastSuccess} = useToast()
    const css = useStyles()

    useEffect(() => {
        _fetch.fetch().then(_ =>
            // console.log(_fetch.list?.data.filter(_ => _.active).map(_ => _.company.id))
            console.log(_fetch.list?.data.filter(_ => !_.active).length)
        )
    }, [])

    useEffect(() => {
        fromNullable(_fetch.error).map(toastError)
    }, [_fetch.error])


    return (
        <Page size="large">
            <PageTitle
                action={
                    <ScButton
                        disabled={_fetch.fetching || _fetch.list?.data.length === 0 || _fetch.list?.data.filter(_ => !_.active).length === 0}
                        variant="contained"
                        color="primary"
                        onClick={() => _remove.fetch({}, _fetch.list!.data.filter(_ => !_.active).map(_ => _.company.id))
                            .then(_ => _fetch.fetch({clean: false}))
                            .catch(toastError)}
                    >
                        {m.activate_all}
                    </ScButton>
                }>{m.notification_settings}</PageTitle>

            <Panel>
                <Datatable<ReportNotificationBlockList>
                    loading={_fetch.fetching}
                    total={_fetch.list?.totalSize}
                    paginate={{
                        limit: _fetch.filters.limit,
                        offset: _fetch.filters.offset,
                        onPaginationChange: pagination => _fetch.updateFilters(prev => ({...prev, ...pagination})),
                    }}
                    getRenderRowKey={_ => _.company.id}
                    data={_fetch.list?.data}
                    rows={[
                        {
                            id: '',
                            className: css.tdName,
                            head: m.name,
                            row: _ => (
                                <>
                                    <span className={css.tdName_label}>{_.company.name}</span>
                                    <br/>
                                    <span className={css.tdName_desc}>{_.company.siret}</span>
                                </>
                            ),
                        },
                        {
                            head: m.address,
                            id: 'address',
                            className: css.tdAddress,
                            row: _ => <AddressComponent address={_.company.address}/>,
                        }, {
                            head: m.status,
                            id: 'status',
                            row: _ =>
                                (
                                    <FormControlLabel
                                        control={<Switch checked={_.active}/>}
                                        onChange={e => {
                                            // _update
                                            //     .fetch({}, _.id, {
                                            //         ..._,
                                            //         kind: _.kind === WebsiteKind.DEFAULT ? WebsiteKind.PENDING : WebsiteKind.DEFAULT,
                                            //     })
                                            //     .then(_ => _fetch.fetch({clean: false}))
                                        }
                                        }
                                        label=""
                                    />
                                ),
                        },
                    ]}
                />
            </Panel>
        </Page>
    )
}
