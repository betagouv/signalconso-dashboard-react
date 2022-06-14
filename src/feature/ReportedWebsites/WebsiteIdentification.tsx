import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Company, Country, Id} from '@signal-conso/signalconso-api-sdk-js'

import Tab from '@mui/material/Tab';
import {TabList, TabPanel} from "@mui/lab";
import TabContext from '@mui/lab/TabContext';
import {ScDialog} from "../../shared/Confirm/ScDialog";
import {CompanyIdentification} from "./CompanyIdentification";
import {CountryIdentification} from "./CountryIdentification";
import {fromNullable} from "fp-ts/lib/Option";
import {useCompaniesContext} from "../../core/context/CompaniesContext";
import {useReportedWebsiteWithCompanyContext} from "../../core/context/ReportedWebsitesContext";
import {useToast} from "../../core/toast";
import {WebsiteUpdateCompany} from "@signal-conso/signalconso-api-sdk-js/lib/model";
import {CountryChip} from "./CountryChip";
import {CompanyChip} from "./CompanyChip";
import {Box, BoxProps} from "@mui/material";
import {Txt} from "mui-extension/lib/Txt/Txt";
import {NoAssociationChip} from "./NoAssociationChip";


interface Website {
  id: Id
  company?: Company
  companyCountry?: Country
}

interface Props extends BoxProps {
  website: Website
  onChangeDone: () => void
}

export const WebsiteIdentification = ({onChangeDone, website, ...props}: Props) => {

  const {m} = useI18n()
  const [value, setValue] = React.useState('1');
  const [open, setOpen] = React.useState(false);
  const _updateCompany = useReportedWebsiteWithCompanyContext().updateCompany
  const _updateCountry = useReportedWebsiteWithCompanyContext().updateCountry
  const [company, setCompany] = useState<WebsiteUpdateCompany | undefined>(website.company)
  const [country, setCountry] = useState<Country | undefined>(website.companyCountry)

  const {toastError, toastInfo, toastSuccess} = useToast()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  const updateCompany = (close: () => void) => {
    if (company) {
      if (website.company && website.company.siret === company.siret) {
        toastInfo(m.alreadySelectedCompany(company.name))
      } else {
        _updateCompany
          .fetch({}, website.id, {
            siret: company.siret,
            name: company.name,
            address: company.address,
            activityCode: company.activityCode,
          })
          .then(_ => toastSuccess(m.websiteEdited))
          .then( _ => onChangeDone())
          .then( _ => close())
      }
    }
  }

  const updateCountry = (close: () => void) => {
    if (country) {
      if (country === website.companyCountry) {
        toastInfo(m.alreadySelectedCountry(country?.name))
      } else {
        _updateCountry.fetch({}, website.id, country)
          .then(_ => toastSuccess(m.websiteEdited))
          .then( _ => onChangeDone())
          .then( _ => close())
      }
    }
  }


  return (
    <ScDialog
      PaperProps={{style: {overflow: "visible"}}}
      maxWidth="sm"
      title="Identification du site internet"
      content={_ => (
        <>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label="basic tabs example">
              <Tab id={"tab-1"} label="Attacher à une entreprise" value="1"/>
              <Tab id={"tab-2"} label="Attacher à un pays étranger" value="2"/>
            </TabList>

            <TabPanel value="1">
              <CompanyIdentification siret={company?.siret} onChange={companyChanged => {
                setCompany(companyChanged)
                setCountry(undefined)
              }}/>
            </TabPanel>

            <TabPanel value="2">
              <CountryIdentification country={website.companyCountry} onChange={companyCountry => {
                setCompany(undefined)
                setCountry(companyCountry)
              }}/>
            </TabPanel>
          </TabContext>
        </>
      )}
      confirmDisabled={(value === "1" && company === undefined) || (value === "2" && country === undefined) }
      onConfirm={(event, close) => {
        company && updateCompany(close)
        country && updateCountry(close)
      }}
    >

      {
        website.companyCountry ?
          <CountryChip onClick={props.onClick} country={website.companyCountry}/>
          : website.company ? <CompanyChip onClick={props.onClick} company={website.company}/> :
            <NoAssociationChip/>
      }
    </ScDialog>
  )
}
