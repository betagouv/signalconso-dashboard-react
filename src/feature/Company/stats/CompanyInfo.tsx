import { Icon } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { Company } from '../../../core/client/company/Company'
import { useI18n } from '../../../core/i18n'
import { AddressComponent } from '../../../shared/Address'

interface Props {
  company: Company
}

export const CompanyInfo = ({ company }: Props) => {
  const { m, formatDate } = useI18n()

  const _activityCodes = useQuery({
    queryKey: ['asyncImportActivityCodes'],
    queryFn: () =>
      import('../../../core/activityCodes').then((_) => _.activityCodes),
  })

  return (
    <CleanInvisiblePanel loading={_activityCodes.isLoading}>
      <h2 className="font-bold text-2xl mb-2">{m.informations}</h2>
      <ul className="grid grid-cols-[auto_auto_1fr] gap-2">
        <Item icon="location_on" label="Adresse">
          <AddressComponent address={company.address} />
        </Item>
        <Item icon="event" label={m.creationDate}>
          <span>{formatDate(company.creationDate)}</span>
        </Item>
        {_activityCodes.data && company.activityCode && (
          <Item icon="label_outline" label={m.activityCode}>
            <span>{_activityCodes.data[company.activityCode]}</span>
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
