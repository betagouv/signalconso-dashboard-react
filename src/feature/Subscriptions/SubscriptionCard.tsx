import React, {CSSProperties, useEffect, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Panel, PanelHead} from '../../shared/Panel'
import {ScSelect} from '../../shared/Select/Select'
import {Chip, Collapse, duration, Icon} from '@mui/material'
import {SubscriptionCardRow} from './SubscriptionCardRow'
import {SelectCompanyDialog} from '../../shared/SelectCompany/SelectCompanyDialog'
import {ScChip} from '../../shared/ScChip'
import {ScChipContainer} from '../../shared/ScChipContainer'
import {useToast} from '../../core/toast'
import {SelectDepartmentsMenu} from '../../shared/SelectDepartments/SelectDepartmentsMenu'
import {SelectCountriesMenu} from '../../shared/SelectCountries/SelectCountriesMenu'
import {SelectMenu} from '../../shared/SelectMenu'
import {IconBtn} from '../../alexlibs/mui-extension'
import {ScDialog} from '../../shared/ScDialog'
import {ScMenuItem} from '../MenuItem/MenuItem'
import {SelectTagsMenu, SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {Enum} from '../../alexlibs/ts-utils'
import {Subscription, SubscriptionCreate} from '../../core/client/subscription/Subscription'
import {ReportSearch} from '../../core/client/report/ReportSearch'
import {Category} from '../../core/client/constant/Category'
import {useCategoriesQuery} from '../../core/queryhooks/constantQueryHooks'
import {useApiContext} from '../../core/context/ApiContext'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {ListSubscriptionsQueryKeys} from '../../core/queryhooks/subscriptionQueryHooks'

interface Props {
  subscription: Subscription
  className?: string
  style?: CSSProperties
}

const useAnchoredMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = (event: any) => setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)
  return {open, close, element: anchorEl}
}

export const SubscriptionCard = ({subscription, className, style}: Props) => {
  const {m} = useI18n()
  const {toastInfo} = useToast()
  const departmentAnchor = useAnchoredMenu()
  const countriesAnchor = useAnchoredMenu()
  const categoryAnchor = useAnchoredMenu()
  const tagsAnchor = useAnchoredMenu()
  const _category = useCategoriesQuery()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _updateSubscription = useMutation({
    mutationFn: (body: Partial<SubscriptionCreate>) => api.secured.subscription.update(subscription.id, body),
    onSuccess: data =>
      queryClient.setQueryData(ListSubscriptionsQueryKeys, (prev: Subscription[]) => {
        const index = prev.findIndex(sub => sub.id === data.id)
        return Object.assign([], prev, {[index]: data}) // replace the subscription
      }),
  })
  const _deleteSubscription = useMutation({
    mutationFn: () => api.secured.subscription.remove(subscription.id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ListSubscriptionsQueryKeys}),
  })

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tags: SelectTagsMenuValues = useMemo(() => {
    const tags: SelectTagsMenuValues = {}
    subscription.withTags?.forEach(tag => {
      tags[tag] = 'included'
    })
    subscription.withoutTags?.forEach(tag => {
      tags[tag] = 'excluded'
    })
    return tags
  }, [subscription.withTags, subscription.withoutTags])

  const fromReportTagValues = (tags: SelectTagsMenuValues): Pick<ReportSearch, 'withTags' | 'withoutTags'> => {
    return {
      withTags: Enum.keys(tags).filter(tag => tags[tag] === 'included'),
      withoutTags: Enum.keys(tags).filter(tag => tags[tag] === 'excluded'),
    }
  }

  return (
    <Collapse in={isMounted} timeout={duration.standard * 1.5}>
      <Panel className={className} style={style}>
        <PanelHead
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          action={
            <>
              <ScSelect
                sx={{mb: 0}}
                value={subscription.frequency ?? 'P7D'}
                onChange={(e: any) => _updateSubscription.mutate({frequency: e.target.value})}
              >
                <ScMenuItem value="P1D">{m.daily}</ScMenuItem>
                <ScMenuItem value="P7D">{m.weekly}</ScMenuItem>
              </ScSelect>
              &nbsp;
              <ScDialog
                title={m.removeSubscription}
                confirmLabel={m.delete}
                onConfirm={(event, close) => {
                  _deleteSubscription.mutate()
                  close()
                }}
              >
                <IconBtn color="primary" loading={_deleteSubscription.isPending}>
                  <Icon>delete</Icon>
                </IconBtn>
              </ScDialog>
            </>
          }
        >
          {m.subscription}
        </PanelHead>

        <SubscriptionCardRow icon="flag" label={m.foreignCountry} onClick={countriesAnchor.open}>
          <ScChipContainer>
            {subscription.countries.map(_ => (
              <ScChip key={_.code} label={_.name} />
            ))}
          </ScChipContainer>
        </SubscriptionCardRow>
        <SelectCountriesMenu
          open={!!countriesAnchor.element}
          onChange={countries => _updateSubscription.mutate({countries})}
          initialValues={subscription.countries.map(_ => _.code)}
          anchorEl={countriesAnchor.element}
          onClose={countriesAnchor.close}
        />

        <SubscriptionCardRow icon="location_on" label={m.departments} onClick={departmentAnchor.open}>
          <ScChipContainer>
            {subscription.departments.map(_ => (
              <ScChip key={_.code} label={_.code + ' - ' + _.label} />
            ))}
          </ScChipContainer>
        </SubscriptionCardRow>
        <SelectDepartmentsMenu
          open={!!departmentAnchor.element}
          anchorEl={departmentAnchor.element}
          initialValues={subscription.departments.map(_ => _.code)}
          onClose={departmentAnchor.close}
          onChange={departments => _updateSubscription.mutate({departments})}
        />
        <SubscriptionCardRow icon="dashboard" label={m.categories} onClick={categoryAnchor.open}>
          <ScChipContainer>
            {subscription.categories.map(_ => (
              <ScChip key={_} label={_} />
            ))}
          </ScChipContainer>
        </SubscriptionCardRow>
        {_category.data && (
          <SelectMenu
            multiple
            options={_category.data}
            renderValue={(option: Category) => m.ReportCategoryDesc[option]}
            initialValue={subscription.categories}
            onClose={categoryAnchor.close}
            open={!!categoryAnchor.element}
            anchorEl={categoryAnchor.element}
            onChange={categories => _updateSubscription.mutate({categories})}
          />
        )}

        <SubscriptionCardRow icon="business" label={m.siret}>
          <ScChipContainer>
            {subscription.sirets.map(siret => (
              <ScChip
                key={siret}
                label={siret}
                onDelete={() => _updateSubscription.mutate({sirets: subscription.sirets.filter(_ => _ !== siret)})}
              />
            ))}
            <SelectCompanyDialog
              onChange={company => {
                if (!subscription.sirets.find(_ => _ === company.siret)) {
                  _updateSubscription.mutate({sirets: [...subscription.sirets, company.siret]})
                } else {
                  toastInfo(m.alreadySelectedCompany(company.name))
                }
              }}
            >
              <ScChip label={<Icon>add</Icon>} />
            </SelectCompanyDialog>
          </ScChipContainer>
        </SubscriptionCardRow>

        <SubscriptionCardRow icon="label" label={m.tags} onClick={tagsAnchor.open}>
          <ScChipContainer>
            {subscription?.withTags.map(_ => (
              <Chip key={_} color="success" icon={<Icon>add</Icon>} label={_} />
            ))}
            {subscription?.withoutTags.map(_ => (
              <Chip key={_} color="error" icon={<Icon>remove</Icon>} label={_} />
            ))}
          </ScChipContainer>
        </SubscriptionCardRow>
        <SelectTagsMenu
          onClose={tagsAnchor.close}
          value={tags}
          onChange={value => _updateSubscription.mutate(fromReportTagValues(value))}
          open={!!tagsAnchor.element}
          anchorEl={tagsAnchor.element}
        />
      </Panel>
    </Collapse>
  )
}
