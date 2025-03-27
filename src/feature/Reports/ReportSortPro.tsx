import { ScButton } from '../../shared/Button'
import { Menu, MenuItem } from '@mui/material'
import React from 'react'

interface Sort {
  sort: string
  order: 'asc' | 'desc'
  name: string
}

const sorts: Sort[] = [
  { sort: 'creationDate', order: 'desc', name: 'Les plus récents' },
  { sort: 'creationDate', order: 'asc', name: 'Les moins récents' },
  {
    sort: 'siretByPendingReport',
    order: 'desc',
    name: 'Etablissements avec le plus de signalements en attente',
  },
  {
    sort: 'siretByPendingReport',
    order: 'asc',
    name: 'Etablissements avec le moins de signalements en attente',
  },
  {
    sort: 'siretByAccount',
    order: 'desc',
    name: 'Etablissements avec le plus de comptes',
  },
  {
    sort: 'siretByAccount',
    order: 'asc',
    name: 'Etablissements avec le moins de comptes',
  },
]

interface ReportSortProProps {
  loading: boolean
  orderBy?: 'asc' | 'desc'
  sortBy?: string
  setSort: (sort: string, order: 'asc' | 'desc') => void
}

export const ReportSortPro = ({
  loading,
  orderBy,
  sortBy,
  setSort,
}: ReportSortProProps) => {
  const foundSort = sorts.find((s) => s.sort === sortBy && s.order === orderBy)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleChange = (s: Sort) => {
    setSort(s.sort, s.order)
    setAnchorEl(null)
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  return (
    <>
      <ScButton
        icon="sort"
        fullWidth={true}
        variant="outlined"
        onClick={handleClick}
        color="secondary"
        loading={loading}
      >
        <span className="w-[200px] truncate">{foundSort?.name ?? 'Trier'}</span>
      </ScButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {sorts.map((sort) => (
          <MenuItem
            key={sort.sort + sort.order}
            onClick={() => handleChange(sort)}
          >
            {sort.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
