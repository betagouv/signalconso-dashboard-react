import {Page, PageTitle} from '../../shared/Layout'
import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useSubscriptionsContext} from '../../core/context/SubscriptionsContext'
import {SubscriptionCard} from './SubscriptionCard'
import {Alert, Animate} from 'mui-extension/lib'
import makeStyles from '@mui/styles/makeStyles'
import {Icon, LinearProgress, Theme} from '@mui/material'
import {Ripple} from '../../shared/Ripple/Ripple'
import {styleUtils} from '../../core/theme'
import {useCssUtils} from '../../core/helper/useCssUtils'

const useStyles = makeStyles((t: Theme) => ({
  alert: {
    marginBottom: t.spacing(2),
  },
  btnAdd: {
    marginTop: t.spacing(3),
    overflow: 'hidden',
    cursor: 'pointer',
    fontWeight: t.typography.fontWeightBold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: t.spacing(2),
    border: `1px dashed ${t.palette.divider}`,
    marginBottom: t.spacing(3),
    color: t.palette.primary.main,
    fontSize: styleUtils(t).fontSize.title,
    borderRadius: 4,
  },
}))

export const Subscriptions = () => {
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const _subscriptions = useSubscriptionsContext()

  useEffect(() => {
    _subscriptions.fetch()
  }, [])

  return (
    <Page size="s">
      <PageTitle>{m.menu_subscriptions}</PageTitle>

      <Alert id="subscriptions-info" type="info" deletable className={css.alert}>
        <div dangerouslySetInnerHTML={{__html: m.subscriptionsAlertInfo}} />
      </Alert>

      {_subscriptions.fetching && <LinearProgress />}
      <Animate>
        <Ripple>
          <div
            className={css.btnAdd}
            title={m.add}
            onClick={() => !_subscriptions.creating && _subscriptions.create({insertBefore: true})}
          >
            <Icon>add</Icon>
            {m.add}
          </div>
        </Ripple>
      </Animate>
      {_subscriptions.list?.map(subscription => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          loading={_subscriptions.updating(subscription.id)}
          removing={_subscriptions.removing(subscription.id)}
          onUpdate={_ => _subscriptions.update(subscription.id, _)}
          onDelete={() => _subscriptions.remove(subscription.id)}
        />
      ))}
    </Page>
  )
}
