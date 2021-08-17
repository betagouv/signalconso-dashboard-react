import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React, {useEffect} from 'react'
import {Panel} from '../../shared/Panel'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Datatable} from '../../shared/Datatable/Datatable'
import {FormControlLabel, Icon, makeStyles, Switch, Theme, Tooltip} from '@material-ui/core'
import {styleUtils} from '../../core/theme'
import {Alert, Fender, IconBtn} from 'mui-extension/lib'
import {ScButton} from '../../shared/Button/Button'
import {AddressComponent} from '../../shared/Address/Address'
import {siteMap} from '../../core/siteMap'
import {NavLink} from 'react-router-dom'
import {AccessLevel} from '../../core/api'
import {useUsersContext} from '../../core/context/UsersContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'

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
    },
    fender: {
        margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
    },
}))

export const CompaniesPro = () => {
    const {m} = useI18n()
    const _companies = useCompaniesContext()
    const cssUtils = useCssUtils()
    const css = useStyles()
    const _users = useUsersContext()

    useEffect(() => {
        _users.getConnectedUser.fetch({force: false})
        _companies.accessesAndNotificationByPro.fetch()
    }, [])

    return (
        <Page size="small">
            <PageTitle>
                {m.myCompanies}
            </PageTitle>

            {_users.getConnectedUser.entity?.disableAllNotifications && (
                <Alert type="info" gutterBottom action={
                    <Switch
                        checked={!_users.getConnectedUser.entity?.disableAllNotifications ?? true}
                        onChange={e =>
                            _users.patchConnectedUser.fetch({}, !e.target.checked).then(_ => _users.getConnectedUser.fetch({}))}
                    />
                }>
                    <Txt bold block>Notifications désactivées</Txt>
                    <Txt color="hint" block>Réactiver les notifications.</Txt>
                </Alert>
            )}
            <Panel>
                <Datatable
                    data={_companies.accessesAndNotificationByPro?.entity}
                    loading={_companies.accessesAndNotificationByPro.loading}
                    getRenderRowKey={_ => _.id}
                    rows={[
                        {
                            id: '',
                            className: css.tdName,
                            head: m.name,
                            row: _ => (
                                <>
                                    <span className={css.tdName_label}>{_.name}</span>
                                    <br/>
                                    <span className={css.tdName_desc}>{_.siret}</span>
                                </>
                            ),
                        },
                        {
                            head: m.address,
                            id: 'address',
                            className: css.tdAddress,
                            row: _ => <AddressComponent address={_.address}/>,
                        },
                        {
                            head: m.notification,
                            id: 'status',
                            row: _ =>
                                (
                                    <FormControlLabel
                                        control={<Switch
                                            disabled={_users.getConnectedUser.entity?.disableAllNotifications}
                                            checked={_.hasNotification}/>}
                                        onChange={e => {
                                            (_.hasNotification ? _companies.blockCompanyNotification.fetch({}, _.id) : _companies.allowCompanyNotification.fetch({}, _.id))
                                                .then(_ => _companies.accessesAndNotificationByPro.fetch({clean: false}))
                                        }
                                        }
                                        label=""
                                    />
                                ),
                        },
                        {
                            head: '',
                            id: 'actions',
                            className: cssUtils.txtRight,
                            row: _ => (
                                <>
                                    {_.level === AccessLevel.ADMIN && (
                                        <NavLink to={siteMap.companyAccesses(_.siret)}>
                                            <Tooltip title={m.handleAccesses}>
                                                <IconBtn color="primary">
                                                    <Icon>vpn_key</Icon>
                                                </IconBtn>
                                            </Tooltip>
                                        </NavLink>
                                    )}
                                    <NavLink to={siteMap.reports({siretSirenList: [_.siret]})}>
                                        <Tooltip title={m.reports}>
                                            <IconBtn color="primary">
                                                <Icon>chevron_right</Icon>
                                            </IconBtn>
                                        </Tooltip>
                                    </NavLink>
                                </>
                            ),
                        },
                    ]}
                    renderEmptyState={
                        <Fender title={m.noCompanyFound} icon="store" className={css.fender}>
                            <ScButton variant="contained" color="primary" icon="add" className={cssUtils.marginTop}>
                                {m.registerACompany}
                            </ScButton>
                        </Fender>
                    }
                />
            </Panel>
        </Page>
    )
}
