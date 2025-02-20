import React, { ReactNode } from 'react'
import { Tooltip } from '@mui/material'
import { siteMap } from '../../core/siteMap'
import { ReportSearch } from '../../core/client/report/ReportSearch'
import { Btn } from '../../alexlibs/mui-extension'
import {useNavigate} from "@tanstack/react-router";

interface ReportSearchLinkProps {
  reportSearch: Partial<ReportSearch>
  value: ReactNode
}

const ReportSearchBtnLink: React.FC<ReportSearchLinkProps> = ({
  reportSearch,
  value,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({to: siteMap.logged.reports(reportSearch)})
  }

  return (
    <Tooltip title="Rechercher sur la page des signalements">
      <Btn onClick={handleClick}>{value}</Btn>
    </Tooltip>
  )
}

export default ReportSearchBtnLink
