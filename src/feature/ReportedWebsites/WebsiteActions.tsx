import {BoxProps, Icon, Tooltip} from "@mui/material";
import React, {useEffect} from "react";
import {IdentificationStatus, WebsiteWithCompany} from "@signal-conso/signalconso-api-sdk-js";
import {IconBtn} from "mui-extension";
import {ScMenu} from "../../shared/Menu/Menu";
import {WebsiteTool} from "./WebsiteTool";
import antidrop from "./antidrop.png";
import whois from "./whois.png";
import internetArchive from "./internetArchive.svg";
import scamdoc from "./scamdoc.png";
import {useI18n} from "../../core/i18n";
import {useReportedWebsiteWithCompanyContext} from "../../core/context/ReportedWebsitesContext";
import {fromNullable} from "fp-ts/lib/Option";
import {useToast} from "../../core/toast";


interface WebsiteActionsProps extends BoxProps {
  website: WebsiteWithCompany,
  refreshData : () => void
}


export const WebsiteActions = ({website, refreshData}: WebsiteActionsProps) => {

  const {m} = useI18n()
  const _updateStatus = useReportedWebsiteWithCompanyContext().update
  const _remove = useReportedWebsiteWithCompanyContext().remove
  const {toastError} = useToast()

  const handleUpdateStatus = (website: WebsiteWithCompany, reload: () => void) => {
    website.identificationStatus === IdentificationStatus.Identified ?
      _updateStatus.fetch({}, website.id, IdentificationStatus.NotIdentified).then(_ => reload())
      : (website.company || website.companyCountry) ? _updateStatus
          .fetch({}, website.id, IdentificationStatus.Identified).then(_ => reload())
        : toastError({message: m.cannotUpdateWebsiteStatus})
  }

  useEffect(() => {
    fromNullable(_updateStatus.error).map(toastError)
    fromNullable(_remove.error).map(toastError)
  }, [_updateStatus.error, _remove.error])


  return (
    <>
      {website.identificationStatus === IdentificationStatus.Identified ? <Tooltip title={m.associationDone}>
          <IconBtn onClick={() => handleUpdateStatus(website,refreshData)}>
            <Icon sx={{color: t => t.palette.success.light}}>check_circle</Icon>
          </IconBtn>
        </Tooltip> : <Tooltip title={m.needAssociation}>
        <IconBtn onClick={() => handleUpdateStatus(website,refreshData)}>
            <Icon sx={{color: t => t.palette.primary.main}}>task_alt</Icon>
          </IconBtn>
        </Tooltip>}
      <Tooltip title={m.identicationTools}>
          <ScMenu>
            <WebsiteTool url="https://antidrop.fr/" src={antidrop} label={m.antidrop} alt={m.antidrop}/>
            <WebsiteTool url={`https://who.is/whois/${website.host}`} src={whois} label={m.whois} alt={m.whois}/>
            <WebsiteTool url={`https://web.archive.org/web/*/${website.host}`} src={internetArchive}
                         label={m.internetArchive} alt={m.internetArchive}/>
            <WebsiteTool url="https://www.scamdoc.com/" src={scamdoc} label={m.scamDoc} alt={m.scamDoc}/>
          </ScMenu>
      </Tooltip>
      <Tooltip title={m.delete}>
        <IconBtn
          sx={{color: t => t.palette.text.disabled}}
          onClick={() => _remove.fetch({}, website.id).then(_ => refreshData())}>
          <Icon>delete</Icon>
        </IconBtn>
      </Tooltip>
    </>
  )
}