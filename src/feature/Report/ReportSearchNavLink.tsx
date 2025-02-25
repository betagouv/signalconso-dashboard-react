import React, { ReactNode } from 'react'
import { Tooltip } from '@mui/material'
import { ReportSearch } from '../../core/client/report/ReportSearch'
import { Link } from '@tanstack/react-router'

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
  return (
    <Tooltip title="Rechercher sur la page des signalements">
      <Link
        className={className}
        to="/suivi-des-signalements"
        search={reportSearch}
      >
        {value}
      </Link>
    </Tooltip>
  )
}

export default ReportSearchNavLink
