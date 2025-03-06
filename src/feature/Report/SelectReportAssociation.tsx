import { BoxProps } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectKeysUnsafe } from 'core/helper'
import { ReactElement, useState } from 'react'
import { Txt } from '../../alexlibs/mui-extension'
import { fnSwitch } from '../../alexlibs/ts-utils'
import { CompanySearchResult } from '../../core/client/company/Company'
import { Country } from '../../core/client/constant/Country'
import { ReportSearchResult } from '../../core/client/report/Report'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import { GetReportQueryKeys } from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { ScRadioGroup } from '../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { SelectCompany } from '../../shared/SelectCompany/SelectCompany'
import { SelectCountry } from '../../shared/SelectCountry'

interface Props extends Omit<BoxProps, 'onChange'> {
  children: ReactElement<any>
  reportId: string
  currentSiret?: string
  currentCountry?: Country
  onChange?: () => void
}

enum AssociationType {
  COMPANY = 'COMPANY',
  COUNTRY = 'COUNTRY',
}

export const SelectReportAssociation = ({
  children,
  onChange,
  reportId,
  currentSiret,
  currentCountry,
  ...props
}: Props) => {
  const { m } = useI18n()
  const { api } = useApiContext()
  const { toastInfo, toastSuccess } = useToast()
  const queryClient = useQueryClient()
  const [selectedAssociation, setSelectedAssociation] =
    useState<AssociationType>(
      currentCountry ? AssociationType.COUNTRY : AssociationType.COMPANY,
    )
  const _updateCompany = useMutation({
    mutationFn: (params: { reportId: string; company: CompanySearchResult }) =>
      api.secured.reports.updateReportCompany(params.reportId, params.company),
    onSuccess: (report) =>
      queryClient.setQueryData(
        GetReportQueryKeys(reportId),
        (prev: ReportSearchResult) => {
          return { report, files: prev?.files ?? [] }
        },
      ),
  })
  const _updateCountry = useMutation({
    mutationFn: (params: { reportId: string; country: Country }) =>
      api.secured.reports.updateReportCountry(params.reportId, params.country),
    onSuccess: (report) =>
      queryClient.setQueryData(
        GetReportQueryKeys(reportId),
        (prev: ReportSearchResult) => {
          return { report, files: prev?.files ?? [] }
        },
      ),
  })

  const [company, setCompany] = useState<CompanySearchResult | undefined>()
  const [country, setCountry] = useState<Country | undefined>(currentCountry)

  const updateCompany = async (close: () => void) => {
    if (company) {
      if (currentSiret === company.siret) {
        toastInfo(m.alreadySelectedCompany(company.name))
      } else {
        _updateCompany
          .mutateAsync({ reportId, company })
          .then((_) => onChange && onChange())
          .then((_) => toastSuccess(m.reportCompanyEdited))
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
          .mutateAsync({ reportId, country })
          .then((_) => onChange && onChange())
          .then((_) => toastSuccess(m.reportCompanyEdited))
          .finally(close)
      }
    }
  }

  return (
    <ScDialog
      PaperProps={{ style: { overflow: 'visible' } }}
      maxWidth="sm"
      title={m.reportAssociation}
      content={(_) => (
        <>
          <Txt block sx={{ mb: 1 }}>
            {m.attachTo}
          </Txt>
          <ScRadioGroup
            sx={{ mb: 2 }}
            dense
            inline
            value={selectedAssociation}
            onChange={setSelectedAssociation}
          >
            {objectKeysUnsafe(AssociationType).map((_) => (
              <ScRadioGroupItem key={_} value={_} title={m.attachToType[_]} />
            ))}
          </ScRadioGroup>

          {selectedAssociation &&
            fnSwitch(selectedAssociation, {
              [AssociationType.COMPANY]: () => (
                <SelectCompany
                  openOnly={false}
                  siret={currentSiret}
                  onChange={(companyChanged) => {
                    setCompany(companyChanged)
                    setCountry(undefined)
                  }}
                />
              ),
              [AssociationType.COUNTRY]: () => (
                <SelectCountry
                  country={currentCountry}
                  onChange={(companyCountry) => {
                    setCompany(undefined)
                    setCountry(companyCountry)
                  }}
                />
              ),
            })}
        </>
      )}
      overrideActions={(close) => (
        <>
          <ScButton onClick={close}>{m.close}</ScButton>
          {selectedAssociation &&
            fnSwitch(selectedAssociation, {
              [AssociationType.COMPANY]: () => (
                <ScButton
                  loading={_updateCompany.isPending}
                  disabled={!company}
                  onClick={() => updateCompany(close)}
                >
                  {m.confirm}
                </ScButton>
              ),
              [AssociationType.COUNTRY]: () => (
                <ScButton
                  loading={_updateCountry.isPending}
                  disabled={!country}
                  onClick={() => updateCountry(close)}
                >
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
