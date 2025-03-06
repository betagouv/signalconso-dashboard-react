import { BoxProps } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { objectKeysUnsafe } from 'core/helper'
import { useState } from 'react'
import { Txt } from '../../../alexlibs/mui-extension'
import { fnSwitch } from '../../../alexlibs/ts-utils'
import { Company } from '../../../core/client/company/Company'
import { Country } from '../../../core/client/constant/Country'
import { WebsiteUpdateCompany } from '../../../core/client/website/Website'
import { useApiContext } from '../../../core/context/ApiContext'
import { useToast } from '../../../core/context/toast/toastContext'
import { useI18n } from '../../../core/i18n'
import { Id } from '../../../core/model'
import { ScButton } from '../../../shared/Button'
import { ScRadioGroup } from '../../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../../shared/RadioGroupItem'
import { ScDialog } from '../../../shared/ScDialog'
import { SelectCompany } from '../../../shared/SelectCompany/SelectCompany'
import { SelectCountry } from '../../../shared/SelectCountry'
import { ChipCompany } from './ChipCompany'
import { ChipCountry } from './ChipCountry'
import { ChipNoAssociation } from './ChipNoAssociation'
import { AssociationType } from './websiteAssociationType'

interface Website {
  id: Id
  company?: Company
  companyCountry?: Country
}

interface Props extends Omit<BoxProps, 'onChange'> {
  website: Website
  onChange: () => void
}

export const SelectWebsiteAssociation = ({
  onChange,
  website,
  ...props
}: Props) => {
  const { m } = useI18n()
  const { api } = useApiContext()
  const { toastInfo, toastSuccess } = useToast()
  const [selectedAssociation, setSelectedAssociation] =
    useState<AssociationType>(
      website.companyCountry
        ? AssociationType.COUNTRY
        : AssociationType.COMPANY,
    )
  const _updateCompany = useMutation({
    mutationFn: (params: { id: Id; website: WebsiteUpdateCompany }) =>
      api.secured.website.updateCompany(params.id, params.website),
    onSuccess: () => {
      onChange()
      toastSuccess(m.websiteEdited)
    },
  })
  const _updateCountry = useMutation({
    mutationFn: (params: { id: Id; country: Country }) =>
      api.secured.website.updateCountry(params.id, params.country),
    onSuccess: () => {
      onChange()
      toastSuccess(m.websiteEdited)
    },
  })

  const [company, setCompany] = useState<WebsiteUpdateCompany | undefined>(
    website.company,
  )
  const [country, setCountry] = useState<Country | undefined>(
    website.companyCountry,
  )

  const updateCompany = async (close: () => void) => {
    if (company) {
      if (website.company && website.company.siret === company.siret) {
        toastInfo(m.alreadySelectedCompany(company.name))
      } else {
        _updateCompany
          .mutateAsync({
            id: website.id,
            website: {
              siret: company.siret,
              name: company.name,
              address: company.address,
              activityCode: company.activityCode,
              isHeadOffice: company.isHeadOffice,
              isOpen: company.isOpen,
              isPublic: company.isPublic,
            },
          })
          .then((_) => close())
      }
    }
  }

  const updateCountry = async (close: () => void) => {
    if (country) {
      if (country === website.companyCountry) {
        toastInfo(m.alreadySelectedCountry(country?.name))
      } else {
        await _updateCountry.mutateAsync({ id: website.id, country })
        close()
      }
    }
  }

  return (
    <ScDialog
      PaperProps={{ style: { overflow: 'visible' } }}
      maxWidth="sm"
      title={m.companyWebsiteAssociation}
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
                  siret={company?.siret}
                  onChange={(companyChanged) => {
                    setCompany(companyChanged)
                    setCountry(undefined)
                  }}
                />
              ),
              [AssociationType.COUNTRY]: () => (
                <SelectCountry
                  country={website.companyCountry}
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
      {website.companyCountry ? (
        <ChipCountry onClick={props.onClick} country={website.companyCountry} />
      ) : website.company ? (
        <ChipCompany onClick={props.onClick} company={website.company} />
      ) : (
        <ChipNoAssociation />
      )}
    </ScDialog>
  )
}
