import React, { ReactNode } from 'react'
import { Tooltip } from '@mui/material'
import { NavLink } from 'react-router'
import { siteMap } from '../../core/siteMap'
import { ReportSearch } from '../../core/client/report/ReportSearch'
import { useLocation, useNavigate } from 'react-router'
import { Btn } from '../../alexlibs/mui-extension'

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
    navigate(siteMap.logged.reports(reportSearch))
  }

  return (
    <Tooltip title="Rechercher sur la page des signalements">
      <Btn onClick={handleClick}>{value}</Btn>
    </Tooltip>
  )
}

export default ReportSearchBtnLink
