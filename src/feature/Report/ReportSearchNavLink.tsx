import React, { ReactNode } from 'react'
import { Tooltip } from '@mui/material'
import { NavLink } from 'react-router'
import { siteMap } from '../../core/siteMap'
import { ReportSearch } from '../../core/client/report/ReportSearch'
import { useLocation } from 'react-router'

interface ReportSearchLinkProps {
  reportSearch: Partial<ReportSearch>
  value: ReactNode
  className?: string
}

const ReportSearchNavLink: React.FC<ReportSearchLinkProps> = ({
  reportSearch,
  value,
  className = '',
}) => {
  const location = useLocation()

  return (
    <Tooltip title="Rechercher sur la page des signalements">
      <NavLink
        className={`${className}`}
        key={location.key}
        to={siteMap.logged.reports(reportSearch)}
      >
        {value}
      </NavLink>
    </Tooltip>
  )
}

export default ReportSearchNavLink
