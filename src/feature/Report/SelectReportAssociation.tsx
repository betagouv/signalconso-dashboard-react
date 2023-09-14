import React, {ReactElement, useState} from 'react'
import {BoxProps} from '@mui/material'
import {CompanySearchResult} from '../../core/client/company/Company'
import {Country} from '../../core/client/constant/Country'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {useReportContext} from '../../core/context/ReportContext'
import {useEffectFn} from '../../alexlibs/react-hooks-lib'
import {ScDialog} from '../../shared/ScDialog'
import {Txt} from '../../alexlibs/mui-extension'
import {ScRadioGroup} from '../../shared/RadioGroup'
import {ScRadioGroupItem} from '../../shared/RadioGroupItem'
import {Enum, fnSwitch} from '../../alexlibs/ts-utils'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {SelectCountry} from '../../shared/SelectCountry'
import {ScButton} from '../../shared/Button'

interface Props extends Omit<BoxProps, 'onChange'> {
  children: ReactElement<any>
  reportId: string
  currentSiret?: string
  currentCountry?: Country
  onChange?: () => void
}

export enum AssociationType {
  COMPANY = 'COMPANY',
  COUNTRY = 'COUNTRY',
}

export const SelectReportAssociation = ({children, onChange, reportId, currentSiret, currentCountry, ...props}: Props) => {
  const {m} = useI18n()
  const {toastError, toastInfo, toastSuccess} = useToast()
  const [selectedAssociation, setSelectedAssociation] = useState<AssociationType>(
    currentCountry ? AssociationType.COUNTRY : AssociationType.COMPANY,
  )
  const _updateCompany = useReportContext().updateCompany
  const _updateCountry = useReportContext().updateCountry
  const [company, setCompany] = useState<CompanySearchResult | undefined>()
  const [country, setCountry] = useState<Country | undefined>(currentCountry)

  useEffectFn(_updateCompany.error, toastError)
  useEffectFn(_updateCountry.error, toastError)

  const updateCompany = async (close: () => void) => {
    if (company) {
      if (currentSiret === company.siret) {
        toastInfo(m.alreadySelectedCompany(company.name))
      } else {
        _updateCompany
          .fetch({}, reportId, company)
          .then(_ => onChange && onChange())
          .then(_ => toastSuccess(m.reportCompanyEdited))
          .then(_ => close())
      }
    }
  }

  const updateCountry = async (close: () => void) => {
    if (country) {
      if (country === currentCountry) {
        toastInfo(m.alreadySelectedCountry(country?.name))
      } else {
        await _updateCountry.fetch({}, reportId, country)
        toastSuccess(m.reportCompanyEdited)
        close()
        onChange && onChange()
      }
    }
  }

  return (
    <ScDialog
      PaperProps={{style: {overflow: 'visible'}}}
      maxWidth="sm"
      title={m.reportAssociation}
      content={_ => (
        <>
          <Txt block sx={{mb: 1}}>
            {m.attachTo}
          </Txt>
          <ScRadioGroup sx={{mb: 2}} dense inline value={selectedAssociation} onChange={setSelectedAssociation}>
            {Enum.keys(AssociationType).map(_ => (
              <ScRadioGroupItem key={_} value={_} title={m.attachToType[_]} />
            ))}
          </ScRadioGroup>

          {selectedAssociation &&
            fnSwitch(selectedAssociation, {
              [AssociationType.COMPANY]: () => (
                <SelectCompany
                  openOnly={false}
                  siret={currentSiret}
                  onChange={companyChanged => {
                    setCompany(companyChanged)
                    setCountry(undefined)
                  }}
                />
              ),
              [AssociationType.COUNTRY]: () => (
                <SelectCountry
                  country={currentCountry}
                  onChange={companyCountry => {
                    setCompany(undefined)
                    setCountry(companyCountry)
                  }}
                />
              ),
            })}
        </>
      )}
      overrideActions={close => (
        <>
          <ScButton onClick={close}>{m.close}</ScButton>
          {selectedAssociation &&
            fnSwitch(selectedAssociation, {
              [AssociationType.COMPANY]: () => (
                <ScButton loading={_updateCompany.loading} disabled={!company} onClick={() => updateCompany(close)}>
                  {m.confirm}
                </ScButton>
              ),
              [AssociationType.COUNTRY]: () => (
                <ScButton loading={_updateCountry.loading} disabled={!country} onClick={() => updateCountry(close)}>
                  {m.confirm}
                </ScButton>
              ),
            })}
        </>
      )}
    >
      {children}
    </ScDialog>
  )
}
