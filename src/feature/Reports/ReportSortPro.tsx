import { ScButton } from '../../shared/Button'
import { Menu, MenuItem } from '@mui/material'
import React from 'react'

interface Sort {
  sort: string
  order: 'asc' | 'desc'
  name: string
}

const sorts: Sort[] = [
  {
    sort: 'creationDate',
    order: 'desc',
    name: 'Par date du plus récent au plus ancien (tri par défaut)',
  },
  {
    sort: 'creationDate',
    order: 'asc',
    name: 'Par date du plus ancien au plus récent',
  },
  {
    sort: 'siretByPendingReport',
    order: 'desc',
    name: 'Afficher en priorité les SIRET avec le plus de signalements',
  },
  {
    sort: 'siretByAccount',
    order: 'desc',
    name: 'Afficher en priorité les SIRET avec le plus de comptes associés',
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
            <span className={sort === foundSort ? 'font-bold' : ''}>
              {sort.name}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
