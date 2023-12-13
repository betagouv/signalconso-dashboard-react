import React, {ReactElement, useState} from 'react'
import {BoxProps} from '@mui/material'
import {CompanySearchResult} from '../../core/client/company/Company'
import {Country} from '../../core/client/constant/Country'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {Txt} from '../../alexlibs/mui-extension'
import {ScRadioGroup} from '../../shared/RadioGroup'
import {ScRadioGroupItem} from '../../shared/RadioGroupItem'
import {Enum, fnSwitch} from '../../alexlibs/ts-utils'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {SelectCountry} from '../../shared/SelectCountry'
import {ScButton} from '../../shared/Button'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {GetReportQueryKeys} from '../../core/queryhooks/reportsHooks'
import {useApiContext} from '../../core/context/ApiContext'
import {ApiError} from '../../core/client/ApiClient'

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
  const {api} = useApiContext()
  const {toastError, toastInfo, toastSuccess} = useToast()
  const queryClient = useQueryClient()
  const [selectedAssociation, setSelectedAssociation] = useState<AssociationType>(
    currentCountry ? AssociationType.COUNTRY : AssociationType.COMPANY,
  )
  const _updateCompany = useMutation(
    (params: {reportId: string; company: CompanySearchResult}) =>
      api.secured.reports.updateReportCompany(params.reportId, params.company),
    {
      onSuccess: () => queryClient.invalidateQueries(GetReportQueryKeys(reportId)),
      onError: error => {
        if (error instanceof ApiError) toastError(error)
      },
    },
  )
  const _updateCountry = useMutation(
    (params: {reportId: string; country: Country}) => api.secured.reports.updateReportCountry(params.reportId, params.country),
    {
      onSuccess: () => queryClient.invalidateQueries(GetReportQueryKeys(reportId)),
      onError: error => {
        if (error instanceof ApiError) toastError(error)
      },
    },
  )

  const [company, setCompany] = useState<CompanySearchResult | undefined>()
  const [country, setCountry] = useState<Country | undefined>(currentCountry)

  const updateCompany = async (close: () => void) => {
    if (company) {
      if (currentSiret === company.siret) {
        toastInfo(m.alreadySelectedCompany(company.name))
      } else {
        _updateCompany
          .mutateAsync({reportId, company})
          .then(_ => onChange && onChange())
          .then(_ => toastSuccess(m.reportCompanyEdited))
          .finally(close)
      }
    }
  }

  const updateCountry = async (close: () => void) => {
    if (country) {
      if (country === currentCountry) {
        toastInfo(m.alreadySelectedCountry(country?.name))
      } else {
        _updateCountry
          .mutateAsync({reportId, country})
          .then(_ => onChange && onChange())
          .then(_ => toastSuccess(m.reportCompanyEdited))
          .finally(close)
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
                <ScButton loading={_updateCompany.isLoading} disabled={!company} onClick={() => updateCompany(close)}>
                  {m.confirm}
                </ScButton>
              ),
              [AssociationType.COUNTRY]: () => (
                <ScButton loading={_updateCountry.isLoading} disabled={!country} onClick={() => updateCountry(close)}>
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
