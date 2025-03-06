import { Chip, Collapse, duration, Icon } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectKeysUnsafe } from 'core/helper'
import React, {
  CSSProperties,
  ReactEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { IconBtn } from '../../alexlibs/mui-extension'
import { Category } from '../../core/client/constant/Category'
import { ReportSearch } from '../../core/client/report/ReportSearch'
import {
  Subscription,
  SubscriptionCreate,
} from '../../core/client/subscription/Subscription'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import { useCategoriesByStatusQuery } from '../../core/queryhooks/constantQueryHooks'
import { ListSubscriptionsQueryKeys } from '../../core/queryhooks/subscriptionQueryHooks'
import { ScChip } from '../../shared/ScChip'
import { ScDialog } from '../../shared/ScDialog'
import { ScSelect } from '../../shared/Select/Select'
import { SelectCompanyDialog } from '../../shared/SelectCompany/SelectCompanyDialog'
import { SelectCountriesMenu } from '../../shared/SelectCountries/SelectCountriesMenu'
import { SelectDepartmentsMenu } from '../../shared/SelectDepartments/SelectDepartmentsMenu'
import { SelectMenu } from '../../shared/SelectMenu'
import {
  SelectTagsMenu,
  SelectTagsMenuValues,
} from '../../shared/SelectTags/SelectTagsMenu'
import { ScMenuItem } from '../MenuItem/MenuItem'
import { SubscriptionCardRow } from './SubscriptionCardRow'
import { SubscriptionInformation } from './SubscriptionInformation'

interface Props {
  subscription: Subscription
  className?: string
  style?: CSSProperties
}

const useAnchoredMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open: ReactEventHandler<HTMLElement> = (event) =>
    setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)
  return { open, close, element: anchorEl }
}

export const SubscriptionCard = ({ subscription, className, style }: Props) => {
  const { m } = useI18n()
  const { toastInfo } = useToast()
  const departmentAnchor = useAnchoredMenu()
  const countriesAnchor = useAnchoredMenu()
  const categoryAnchor = useAnchoredMenu()
  const tagsAnchor = useAnchoredMenu()
  const _categories = useCategoriesByStatusQuery()
  const _activeCategories = _categories.data?.active
  const _outdatedCategories = [
    ...(_categories.data?.inactive ?? []),
    ...(_categories.data?.closed ?? []),
    ...(_categories.data?.legacy ?? []),
  ]
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const _updateSubscription = useMutation({
    mutationFn: (body: Partial<SubscriptionCreate>) =>
      api.secured.subscription.update(subscription.id, body),
    onSuccess: (data) =>
      queryClient.setQueryData(
        ListSubscriptionsQueryKeys,
        (prev: Subscription[]) => {
          const index = prev.findIndex((sub) => sub.id === data.id)
          return Object.assign([], prev, { [index]: data }) // replace the subscription
        },
      ),
  })
  const _deleteSubscription = useMutation({
    mutationFn: () => api.secured.subscription.remove(subscription.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ListSubscriptionsQueryKeys }),
  })

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tags: SelectTagsMenuValues = useMemo(() => {
    const tags: SelectTagsMenuValues = {}
    subscription.withTags?.forEach((tag) => {
      tags[tag] = 'included'
    })
    subscription.withoutTags?.forEach((tag) => {
      tags[tag] = 'excluded'
    })
    return tags
  }, [subscription.withTags, subscription.withoutTags])

  const fromReportTagValues = (
    tags: SelectTagsMenuValues,
  ): Pick<ReportSearch, 'withTags' | 'withoutTags'> => {
    return {
      withTags: objectKeysUnsafe(tags).filter(
        (tag) => tags[tag] === 'included',
      ),
      withoutTags: objectKeysUnsafe(tags).filter(
        (tag) => tags[tag] === 'excluded',
      ),
    }
  }

  const allCategoriesSelected = subscription.categories.length === 0

  return (
    <Collapse in={isMounted} timeout={duration.standard * 1.5}>
      <CleanWidePanel>
        <div className="flex items-center justify-between">
          <span>{m.subscription}</span>
          <div className="flex items-center">
            <ScSelect
              value={subscription.frequency ?? 'P7D'}
              onChange={(e: any) =>
                _updateSubscription.mutate({ frequency: e.target.value })
              }
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
          </div>
        </div>
        <div className="mb-2">
          <SubscriptionInformation
            outdatedCategories={_outdatedCategories}
            subscription={subscription}
          />
        </div>

        <SubscriptionCardRow
          icon="flag"
          label={m.foreignCountry}
          onClick={countriesAnchor.open}
        >
          <div className="flex flex-row gap-1 flex-wrap">
            {subscription.countries.map((_) => (
              <ScChip key={_.code} label={_.name} />
            ))}
          </div>
        </SubscriptionCardRow>
        <SelectCountriesMenu
          open={!!countriesAnchor.element}
          onChange={(countries) => _updateSubscription.mutate({ countries })}
          initialValues={subscription.countries.map((_) => _.code)}
          anchorEl={countriesAnchor.element}
          onClose={countriesAnchor.close}
        />

        <SubscriptionCardRow
          icon="location_on"
          label={m.departments}
          onClick={departmentAnchor.open}
        >
          <div className="flex flex-row gap-1 flex-wrap">
            {subscription.departments.map((_) => (
              <ScChip key={_.code} label={_.code + ' - ' + _.label} />
            ))}
          </div>
        </SubscriptionCardRow>
        <SelectDepartmentsMenu
          open={!!departmentAnchor.element}
          anchorEl={departmentAnchor.element}
          initialValues={subscription.departments.map((_) => _.code)}
          onClose={departmentAnchor.close}
          onChange={(departments) =>
            _updateSubscription.mutate({ departments })
          }
        />
        <SubscriptionCardRow
          icon="dashboard"
          label={m.categories}
          onClick={categoryAnchor.open}
        >
          <div className="flex flex-row gap-1 flex-wrap">
            {allCategoriesSelected ? (
              <ScChip
                variant="outlined"
                color="default"
                key="all"
                label={<i>N'importe quelle catégorie</i>}
              />
            ) : (
              subscription.categories.map((_) => <ScChip key={_} label={_} />)
            )}
          </div>
        </SubscriptionCardRow>
        {_activeCategories && (
          <SelectMenu
            multiple
            options={_activeCategories}
            renderValue={(option: Category) => m.ReportCategoryDesc[option]}
            initialValue={subscription.categories}
            onClose={categoryAnchor.close}
            open={!!categoryAnchor.element}
            anchorEl={categoryAnchor.element}
            onChange={(categories) =>
              _updateSubscription.mutate({ categories })
            }
          />
        )}

        <SubscriptionCardRow icon="business" label={m.siret}>
          <div className="flex flex-row gap-1 flex-wrap">
            {subscription.sirets.map((siret) => (
              <ScChip
                key={siret}
                label={siret}
                onDelete={() =>
                  _updateSubscription.mutate({
                    sirets: subscription.sirets.filter((_) => _ !== siret),
                  })
                }
              />
            ))}
            <SelectCompanyDialog
              onChange={(company) => {
                if (!subscription.sirets.find((_) => _ === company.siret)) {
                  _updateSubscription.mutate({
                    sirets: [...subscription.sirets, company.siret],
                  })
                } else {
                  toastInfo(m.alreadySelectedCompany(company.name))
                }
              }}
            >
              <ScChip
                label={<Icon sx={{ verticalAlign: 'middle' }}>add</Icon>}
              />
            </SelectCompanyDialog>
          </div>
        </SubscriptionCardRow>

        <SubscriptionCardRow
          icon="label"
          label={m.tags}
          onClick={tagsAnchor.open}
        >
          <div className="flex flex-row gap-1 flex-wrap">
            {subscription?.withTags.map((_) => (
              <Chip key={_} color="success" icon={<Icon>add</Icon>} label={_} />
            ))}
            {subscription?.withoutTags.map((_) => (
              <Chip
                key={_}
                color="error"
                icon={<Icon>remove</Icon>}
                label={_}
              />
            ))}
          </div>
        </SubscriptionCardRow>
        <SelectTagsMenu
          onClose={tagsAnchor.close}
          value={tags}
          onChange={(value) =>
            _updateSubscription.mutate(fromReportTagValues(value))
          }
          open={!!tagsAnchor.element}
          anchorEl={tagsAnchor.element}
        />
      </CleanWidePanel>
    </Collapse>
  )
}
