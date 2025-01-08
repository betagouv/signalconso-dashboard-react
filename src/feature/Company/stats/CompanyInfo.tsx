import { Icon } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { Company } from '../../../core/client/company/Company'
import { useI18n } from '../../../core/i18n'
import { AddressComponent } from '../../../shared/Address'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

interface Props {
  company: Company
}

export const CompanyInfo = ({ company }: Props) => {
  const { m } = useI18n()

  const _activityCodes = useQuery({
    queryKey: ['asyncImportActivityCodes'],
    queryFn: () =>
      import('../../../core/activityCodes').then((_) => _.activityCodes),
  })

  return (
    <CleanInvisiblePanel loading={_activityCodes.isLoading}>
      <CompanyStatsPanelTitle bottomMargin>
        {m.informations}
      </CompanyStatsPanelTitle>
      <ul className="grid grid-cols-[auto_auto_1fr] gap-2">
        <Item icon="location_on" label="Adresse">
          <div className="text-sm">
            <AddressComponent address={company.address} />
          </div>
        </Item>
        {_activityCodes.data && company.activityCode && (
          <Item icon="label_outline" label={m.activityCode}>
            <span>
              <span className="font-bold">{company.activityCode}</span>{' '}
              <span className="text-gray-500">
                {_activityCodes.data[company.activityCode]}
              </span>
            </span>
          </Item>
        )}
      </ul>
    </CleanInvisiblePanel>
  )
}

function Item({
  icon,
  children,
  label,
}: {
  icon: string
  children: ReactNode
  label: string
}) {
  return (
    <li className="contents">
      <Icon fontSize="small" className="block mt-[3px]">
        {icon}
      </Icon>
      <p className="text-gray-500">{label} :</p>
      <div>{children}</div>
    </li>
  )
}
