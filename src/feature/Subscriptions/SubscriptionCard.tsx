import React, {CSSProperties, SyntheticEvent, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {ReportTag, Subscription, SubscriptionCreate} from '../../core/api'
import {Panel, PanelHead} from '../../shared/Panel'
import {ScSelect} from '../../shared/Select/Select'
import {Collapse, duration, Icon, MenuItem, Theme} from '@material-ui/core'
import {SubscriptionCardRow} from './SubscriptionCardRow'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {ScChip} from '../../shared/Chip/ScChip'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {ScChipContainer} from '../../shared/Chip/ScChipContainer'
import {useToast} from '../../core/toast'
import {SelectDepartmentsMenu} from '../../shared/SelectDepartments/SelectDepartmentsMenu'
import {SelectCountriesMenu} from '../../shared/SelectCountries/SelectCountriesMenu'
import {SelectMenu} from '../../shared/SelectMenu/SelectMenu'
import {useAnomalyContext} from '../../core/context/AnomalyContext'
import {Confirm, IconBtn} from 'mui-extension/lib'
import {makeStyles} from '@material-ui/core/styles'
import {ScDialog} from '../../shared/Confirm/ScDialog'

interface Props {
  subscription: Subscription
  onUpdate: (_: Partial<SubscriptionCreate>) => Promise<Subscription>
  onDelete: (event: SyntheticEvent<any>) => void
  removing: boolean
  loading?: boolean
  className?: string
  style?: CSSProperties
}

const useStyles = makeStyles((t: Theme) => ({
  head: {
    display: 'flex',
    alignItems: 'center',
  },
  selectFrequency: {
    margin: 0,
  },
}))

const useAnchoredMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = (event: any) => setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)
  return {open, close, element: anchorEl}
}

export const SubscriptionCard = ({subscription, onUpdate, onDelete, removing, loading, className, style}: Props) => {
  const {m} = useI18n()
  const {toastInfo} = useToast()
  const cssUtils = useCssUtils()
  const departmentAnchor = useAnchoredMenu()
  const countriesAnchor = useAnchoredMenu()
  const categoryAnchor = useAnchoredMenu()
  const tagsAnchor = useAnchoredMenu()
  const _category = useAnomalyContext().category
  const css = useStyles()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    _category.fetch({force: false})
    setIsMounted(true)
  }, [])

  return (
    <Collapse in={isMounted} timeout={duration.standard * 1.5}>
      <Panel loading={loading} className={className} style={style}>
        <PanelHead
          className={css.head}
          action={
            <>
              <ScSelect
                className={css.selectFrequency}
                value={subscription.frequency ?? 'P7D'}
                onChange={(e: any) => onUpdate({frequency: e.target.value})}
              >
                <MenuItem value="P1D">{m.daily}</MenuItem>
                <MenuItem value="P7D">{m.weekly}</MenuItem>
              </ScSelect>
              &nbsp;
              <ScDialog title={m.removeSubscription} confirmLabel={m.delete} onConfirm={onDelete}>
                <IconBtn color="primary" loading={removing}>
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
          onChange={countries => onUpdate({countries})}
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
          onChange={departments => onUpdate({departments})}
        />
        <SubscriptionCardRow icon="dashboard" label={m.categories} onClick={categoryAnchor.open}>
          <ScChipContainer>
            {subscription.categories.map(_ => (
              <ScChip key={_} label={_} />
            ))}
          </ScChipContainer>
        </SubscriptionCardRow>
        {_category.entity && (
          <SelectMenu
            multiple
            options={_category.entity}
            initialValue={subscription.categories}
            onClose={categoryAnchor.close}
            open={!!categoryAnchor.element}
            anchorEl={categoryAnchor.element}
            onChange={categories => onUpdate({categories})}
          />
        )}

        <SubscriptionCardRow icon="business" label={m.siret}>
          <ScChipContainer>
            {subscription.sirets.map(siret => (
              <ScChip key={siret} label={siret} onDelete={() => onUpdate({sirets: subscription.sirets.filter(_ => _ !== siret)})} />
            ))}
            <SelectCompany
              onChange={company => {
                if (!subscription.sirets.find(_ => _ === company.siret)) {
                  onUpdate({sirets: [...subscription.sirets, company.siret]})
                } else {
                  toastInfo(m.alreadySelectedCompany(company.name))
                }
              }}
            >
              <ScChip label={<Icon>add</Icon>} />
            </SelectCompany>
          </ScChipContainer>
        </SubscriptionCardRow>

        <SubscriptionCardRow icon="label" label={m.tags} onClick={tagsAnchor.open}>
          <ScChipContainer>
            {subscription.tags.map(_ => (
              <ScChip key={_} label={_} />
            ))}
          </ScChipContainer>
        </SubscriptionCardRow>
        <SelectMenu
          multiple
          options={Object.values(ReportTag)}
          initialValue={subscription.tags}
          onClose={tagsAnchor.close}
          open={!!tagsAnchor.element}
          anchorEl={tagsAnchor.element}
          onChange={tags => onUpdate({tags})}
        />
      </Panel>
    </Collapse>
  )
}
