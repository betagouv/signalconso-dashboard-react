import {Page, PageTitle} from '../../shared/Page'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {SubscriptionCard} from './SubscriptionCard'
import {Alert} from '../../alexlibs/mui-extension'
import {Box, Icon, LinearProgress} from '@mui/material'
import {Ripple} from '../../shared/Ripple'
import {styleUtils} from '../../core/theme'
import {Animate} from 'alexlibs/mui-extension/Animate'
import {ListSubscriptionsQueryKeys, useListSubscriptionsQuery} from '../../core/queryhooks/subscriptionQueryHooks'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useApiContext} from '../../core/context/ApiContext'
import {Subscription} from '../../core/client/subscription/Subscription'

export const Subscriptions = () => {
  const {m} = useI18n()
  const _subscriptions = useListSubscriptionsQuery()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _createSubscription = useMutation({
    mutationFn: () => api.secured.subscription.create(),
    onSuccess: data => {
      queryClient.setQueryData(ListSubscriptionsQueryKeys, (prev: Subscription[]) => [data, ...prev])
    },
  })

  return (
    <Page size="s">
      <PageTitle>{m.menu_subscriptions}</PageTitle>

      <Alert id="subscriptions-info" type="info" deletable sx={{mb: 2}}>
        <div dangerouslySetInnerHTML={{__html: m.subscriptionsAlertInfo}} />
      </Alert>

      {_subscriptions.isFetching && <LinearProgress />}
      <Animate>
        <Ripple>
          <Box
            sx={{
              my: 3,
              overflow: 'hidden',
              cursor: 'pointer',
              fontWeight: t => t.typography.fontWeightBold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              border: t => `1px dashed ${t.palette.divider}`,
              color: t => t.palette.primary.main,
              fontSize: t => styleUtils(t).fontSize.title,
              borderRadius: t => t.shape.borderRadius + 'px',
            }}
            title={m.add}
            onClick={() => !_createSubscription.isPending && _createSubscription.mutate()}
          >
            <Icon>add</Icon>
            {m.add}
          </Box>
        </Ripple>
      </Animate>
      {_subscriptions.data?.map(subscription => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </Page>
  )
}
