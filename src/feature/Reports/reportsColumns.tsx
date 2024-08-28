import { useI18n } from '../../core/i18n'

import { Badge, Box, Checkbox, Chip, Icon, Tooltip } from '@mui/material'
import { UseSetState } from 'alexlibs/react-hooks-lib'
import { useConnectedContext } from 'core/context/ConnectedContext'
import {
  Paginate,
  PaginatedFilters,
  ReportSearch,
  ReportSearchResult,
} from 'core/model'
import { UseQueryPaginateResult } from 'core/queryhooks/UseQueryPaginate'
import { NavLink } from 'react-router-dom'
import { Fender, IconBtn, Txt } from '../../alexlibs/mui-extension'
import { EntityIcon } from '../../core/EntityIcon'
import { textOverflowMiddleCropping } from '../../core/helper'
import { siteMap } from '../../core/siteMap'
import { ScButton } from '../../shared/Button'
import CompanyNameDetails from './CompanyNameDetails'

type ColumnProps = { r: ReportSearchResult }

export function CheckboxColumnHead({
  _reports,
  selectReport,
}: {
  _reports: UseQueryPaginateResult<
    ReportSearch & PaginatedFilters,
    Paginate<ReportSearchResult>,
    unknown
  >
  selectReport: UseSetState<string>
}) {
  const allChecked = selectReport.size === _reports.result.data?.entities.length
  return (
    <Checkbox
      disabled={_reports.result.isFetching}
      indeterminate={selectReport.size > 0 && !allChecked}
      checked={allChecked}
      onChange={() => {
        if (allChecked) {
          selectReport.clear()
        } else {
          selectReport.add(
            _reports.result.data!.entities!.map((_) => _.report.id),
          )
        }
      }}
    />
  )
}

export function CheckboxColumn({
  r,
  selectReport,
}: ColumnProps & { selectReport: UseSetState<string> }) {
  return (
    <Checkbox
      checked={selectReport.has(r.report.id)}
      onChange={() => selectReport.toggle(r.report.id)}
    />
  )
}

export function PostalCodeColumn({ r }: ColumnProps) {
  return (
    <>
      <span>{r.report.companyAddress.postalCode?.slice(0, 2)}</span>
      <Box component="span" sx={{ color: (t) => t.palette.text.disabled }}>
        {r.report.companyAddress.postalCode?.substr(2, 5)}
      </Box>
    </>
  )
}

export function CompanyNameColumn({ r }: ColumnProps) {
  const { connectedUser } = useConnectedContext()
  return (
    <CompanyNameDetails
      companyId={r.report.companyId}
      isDGAL={connectedUser.isDGAL}
      companyName={r.report.companyName}
      additionalLabel={
        r.report.websiteURL ? r.report.websiteURL : r.report.companyBrand
      }
    />
  )
}

export function SiretColumn({ r }: ColumnProps) {
  const { connectedUser } = useConnectedContext()
  return (
    <>
      {r.report.companyId && !connectedUser.isDGAL ? (
        <NavLink
          to={siteMap.logged.company(r.report.companyId).stats.valueAbsolute}
        >
          <Txt link sx={{ marginBottom: '-1px' }}>
            {r.report.companySiret}
          </Txt>
        </NavLink>
      ) : (
        <span>{r.report.companySiret}</span>
      )}
    </>
  )
}

export function CategoryColumn({ r }: ColumnProps) {
  const { m } = useI18n()
  return (
    <Tooltip
      title={
        <>
          <b>{m.ReportCategoryDesc[r.report.category]}</b>
          <Box component="ul" sx={{ m: 0, p: 2 }}>
            {r.report.subcategories.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </Box>
        </>
      }
    >
      <span>{m.ReportCategoryDesc[r.report.category]}</span>
    </Tooltip>
  )
}

export function TagsColumn({ r }: ColumnProps) {
  const { m } = useI18n()
  return r.report.tags.map((tag) => (
    <Chip
      key={tag}
      size="small"
      variant="outlined"
      label={m.reportTagDesc[tag]}
      sx={{
        fontWeight: (t) => t.typography.fontWeightBold,
        color: (t) => t.palette.text.secondary,
      }}
      style={{ marginRight: 2 }}
    />
  ))
}

export function EmailColumn({ r }: ColumnProps) {
  return (
    <span>
      <Box
        component="span"
        sx={{
          ...(r.report.contactAgreement
            ? {
                color: (t) => t.palette.success.light,
              }
            : {
                color: (t) => t.palette.error.main,
              }),
        }}
      >
        {textOverflowMiddleCropping(r.report.email ?? '', 25)}
      </Box>
      <br />
      <Txt color="hint" size="small">
        {r.report.consumerPhone ?? ''}
      </Txt>
    </span>
  )
}

export function FilesColumn({ r }: ColumnProps) {
  return (
    r.files.length > 0 && (
      <Badge
        badgeContent={r.files.length}
        color="primary"
        invisible={r.files.length === 1}
      >
        <Icon sx={{ color: (t) => t.palette.text.disabled }}>
          insert_drive_file
        </Icon>
      </Badge>
    )
  )
}

export function ActionsColumn({ r }: ColumnProps) {
  return (
    <NavLink to={siteMap.logged.report(r.report.id)}>
      <IconBtn color="primary">
        <Icon>chevron_right</Icon>
      </IconBtn>
    </NavLink>
  )
}

export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  const { m } = useI18n()
  return (
    <Fender
      icon={EntityIcon.report}
      title={m.noReportsTitle}
      description={
        <>
          <Txt color="hint" size="big" block gutterBottom>
            {m.noReportsDesc}
          </Txt>
          <ScButton
            icon="clear"
            onClick={onClearFilters}
            variant="contained"
            color="primary"
          >
            {m.removeAllFilters}
          </ScButton>
        </>
      }
    />
  )
}
