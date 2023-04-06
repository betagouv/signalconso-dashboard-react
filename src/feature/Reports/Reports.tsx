import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useReportsContext} from '../../core/context/ReportsContext'

import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Badge, Box, Checkbox, Chip, Collapse, Grid, Icon, MenuItem, Tooltip} from '@mui/material'
import {styled} from '@mui/material/styles'
import {cleanObject, getHostFromUrl, textOverflowMiddleCropping} from '../../core/helper'
import React, {useEffect, useMemo} from 'react'
import {
  mapArrayFromQuerystring,
  mapBooleanFromQueryString,
  mapDateFromQueryString,
  mapDatesToQueryString,
  useQueryString,
} from '../../core/helper/useQueryString'
import {NavLink} from 'react-router-dom'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {Btn, Fender, IconBtn, PanelBody, Txt} from '../../alexlibs/mui-extension'
import {useToast} from '../../core/toast'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import {config} from '../../conf/config'
import {siteMap} from '../../core/siteMap'
import {ExportReportsPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {EntityIcon} from '../../core/EntityIcon'
import {ScButton} from '../../shared/Button/Button'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {ReportDetailValues} from '../../shared/ReportDetailValues/ReportDetailValues'
import {styleUtils, sxUtils} from '../../core/theme'
import compose from '../../core/helper/compose'
import {useSetState} from '../../alexlibs/react-hooks-lib'
import {DatatableToolbar} from '../../shared/Datatable/DatatableToolbar'
import {useReportContext} from '../../core/context/ReportContext'
import {Report, ReportingDateLabel, ReportStatus, ReportTag} from '../../core/client/report/Report'
import {Id, ReportSearch} from '../../core/model'
import {ScOption} from 'core/helper/ScOption'
import {TrueFalseNull} from '../../shared/TrueFalseUndefined/TrueFalseNull'
import {ScInput} from '../../shared/Input/ScInput'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'
import {SelectTags} from '../../shared/SelectTags/SelectTags'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {Enum} from '../../alexlibs/ts-utils'
import {ScSelect} from '../../shared/Select/Select'
import {useConstantContext} from '../../core/context/ConstantContext'
import {ScMenuItem} from '../../shared/MenuItem/ScMenuItem'
import {ScMultiSelect} from '../../shared/Select/MultiSelect'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const TrueLabel = () => {
  const {m} = useI18n()
  return (
    <>
      {m.yes}{' '}
      <Icon fontSize="inherit" sx={{mr: '-4px'}}>
        arrow_drop_down
      </Icon>
    </>
  )
}

const ExpandMore = styled((props: {expand: boolean}) => {
  const {expand, ...other} = props
  return <ExpandMoreIcon {...other} />
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

interface ReportSearchQs {
  readonly departments?: string[] | string
  readonly tags?: ReportTag[] | ReportTag
  readonly companyCountries?: string[] | string
  readonly siretSirenList?: string[] | string
  readonly activityCodes?: string[] | string
  start?: string
  end?: string
  email?: string
  websiteURL?: string
  phone?: string
  category?: string
  status?: string[]
  details?: string
  hasWebsite?: boolean
  hasPhone?: boolean
  hasCompany?: boolean
  hasForeignCountry?: boolean
  offset: number
  limit: number
}

export const Reports = () => {
  const {m, formatDate} = useI18n()
  const _report = useReportContext()
  const _reports = useReportsContext()
  const selectReport = useSetState<Id>()
  const [expanded, setExpanded] = React.useState(false)
  const {toastError} = useToast()
  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportSearchQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(
      mapDateFromQueryString,
      mapArrayFromQuerystring(['status', 'departments', 'tags', 'companyCountries', 'siretSirenList', 'activityCodes']),
      mapBooleanFromQueryString(['hasCompany', 'hasForeignCountry', 'hasPhone', 'hasWebsite']),
    ),
  })

  useEffect(() => {
    _reports.updateFilters({..._reports.initialFilters, ...queryString.get()})
  }, [])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  useEffect(() => {
    ScOption.from(_reports.error).map(toastError)
  }, [_reports.list, _reports.error])

  const getReportingDate = (report: Report) =>
    report.details.filter(_ => _.label.indexOf(ReportingDateLabel) !== -1).map(_ => _.value)

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _reports.filters
    return Object.keys(cleanObject(filters)).length
  }, [_reports.filters])

  const tags: SelectTagsMenuValues = {}
  _reports.filters.withTags?.forEach(tag => {
    tags[tag] = 'included'
  })
  _reports.filters.withoutTags?.forEach(tag => {
    tags[tag] = 'excluded'
  })

  const _category = useConstantContext().categories

  useEffect(() => {
    _category.fetch({force: false})
  }, [])

  function invertIfDefined(bool: boolean | null) {
    return bool === null ? null : !bool
  }

  return (
    <Page size="xl">
      <PageTitle>{m.reports_pageTitle}</PageTitle>
      <Panel elevation={3}>
        <PanelBody>
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <DebouncedInput
                value={_reports.filters.departments}
                onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
              >
                {(value, onChange) => (
                  <SelectDepartments label={m.departments} value={value} onChange={onChange} sx={{mr: 1}} fullWidth />
                )}
              </DebouncedInput>
            </Grid>
            <Grid item xs={12} md={6}>
              <DebouncedInput<[Date | undefined, Date | undefined]>
                value={[_reports.filters.start, _reports.filters.end]}
                onChange={([start, end]) => {
                  _reports.updateFilters(prev => ({...prev, start, end}))
                }}
              >
                {(value, onChange) => <PeriodPicker value={value} onChange={onChange} sx={{mr: 1}} fullWidth />}
              </DebouncedInput>
            </Grid>
            <Grid item xs={12} md={6}>
              <DebouncedInput
                value={_reports.filters.details ?? ''}
                onChange={details => _reports.updateFilters(prev => ({...prev, details}))}
              >
                {(value, onChange) => (
                  <ScInput label={m.keywords} fullWidth value={value} onChange={e => onChange(e.target.value)} />
                )}
              </DebouncedInput>
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectTags
                label={m.tags}
                fullWidth
                value={tags}
                onChange={e =>
                  _reports.updateFilters(prev => ({
                    ...prev,
                    withTags: Enum.keys(e).filter(tag => e[tag] === 'included'),
                    withoutTags: Enum.keys(e).filter(tag => e[tag] === 'excluded'),
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: '8px',
                  }}
                >
                  <Box>{m.siretOrSirenFound}</Box>
                  <TrueFalseNull
                    label={{
                      true: <TrueLabel />,
                    }}
                    sx={{mt: 1}}
                    value={_reports.filters.hasCompany ?? null}
                    onChange={hasCompany =>
                      _reports.updateFilters(prev => ({
                        ...prev,
                        hasCompany: hasCompany ?? undefined,
                      }))
                    }
                  />
                </Box>
                {_reports.filters.hasCompany === true && (
                  <DebouncedInput
                    value={_reports.filters.siretSirenList ?? []}
                    onChange={siretSirenList => _reports.updateFilters(prev => ({...prev, siretSirenList}))}
                  >
                    {(value, onChange) => (
                      <ScInput label={m.siretOrSiren} fullWidth value={value} onChange={e => onChange([e.target.value])} />
                    )}
                  </DebouncedInput>
                )}
              </Box>
            </Grid>
          </Grid>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <SelectActivityCode
                  label={m.codeNaf}
                  value={_reports.filters.activityCodes ?? []}
                  fullWidth
                  onChange={(e, value) =>
                    _reports.updateFilters(prev => ({
                      ...prev,
                      activityCodes: value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ScSelect
                  small
                  label={m.categories}
                  fullWidth
                  value={_reports.filters.category ?? ''}
                  onChange={e => _reports.updateFilters(prev => ({...prev, category: e.target.value}))}
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {_category?.entity?.map(category => (
                    <MenuItem key={category} value={category}>
                      {m.ReportCategoryDesc[category]}
                    </MenuItem>
                  ))}
                </ScSelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <ScMultiSelect
                  label={m.status}
                  value={_reports.filters.status ?? []}
                  onChange={status => _reports.updateFilters(prev => ({...prev, status}))}
                  fullWidth
                  withSelectAll
                  renderValue={status => `(${status.length}) ${status.map(_ => m.reportStatusShort[_]).join(',')}`}
                >
                  {Enum.values(ReportStatus).map(status => (
                    <ScMenuItem withCheckbox key={status} value={status}>
                      <ReportStatusLabel inSelectOptions dense fullWidth status={status} />
                    </ScMenuItem>
                  ))}
                </ScMultiSelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedInput
                  value={_reports.filters.email ?? ''}
                  onChange={email => _reports.updateFilters(prev => ({...prev, email}))}
                >
                  {(value, onChange) => (
                    <ScInput label={m.emailConsumer} fullWidth value={value} onChange={e => onChange(e.target.value)} />
                  )}
                </DebouncedInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: '8px',
                    }}
                  >
                    <Box>{m.website}</Box>
                    <TrueFalseNull
                      label={{
                        true: <TrueLabel />,
                      }}
                      sx={{mt: 1}}
                      value={_reports.filters.hasWebsite ?? null}
                      onChange={hasWebsite =>
                        _reports.updateFilters(prev => ({
                          ...prev,
                          hasWebsite: hasWebsite ?? undefined,
                        }))
                      }
                    />
                  </Box>
                  {_reports.filters.hasWebsite === true && (
                    <DebouncedInput
                      value={_reports.filters.websiteURL ?? ''}
                      onChange={websiteURL => _reports.updateFilters(prev => ({...prev, websiteURL}))}
                    >
                      {(value, onChange) => (
                        <ScInput label={m.url} fullWidth value={value} onChange={e => onChange(e.target.value)} />
                      )}
                    </DebouncedInput>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: '8px',
                    }}
                  >
                    <Box>{m.phone}</Box>
                    <TrueFalseNull
                      label={{
                        true: <TrueLabel />,
                      }}
                      sx={{mt: 1}}
                      value={_reports.filters.hasPhone ?? null}
                      onChange={hasPhone =>
                        _reports.updateFilters(prev => ({
                          ...prev,
                          hasPhone: hasPhone ?? undefined,
                        }))
                      }
                    />
                  </Box>
                  {_reports.filters.hasPhone === true && (
                    <DebouncedInput
                      value={_reports.filters.phone ?? ''}
                      onChange={phone => _reports.updateFilters(prev => ({...prev, phone}))}
                    >
                      {(value, onChange) => (
                        <ScInput label={m.phone} fullWidth value={value} onChange={e => onChange(e.target.value)} />
                      )}
                    </DebouncedInput>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: '8px',
                    }}
                  >
                    <Box>{m.foreignCountry}</Box>
                    <TrueFalseNull
                      label={{
                        true: <TrueLabel />,
                      }}
                      sx={{mt: 1}}
                      value={_reports.filters.hasForeignCountry ?? null}
                      onChange={hasForeignCountry =>
                        _reports.updateFilters(prev => ({
                          ...prev,
                          hasForeignCountry: hasForeignCountry ?? undefined,
                        }))
                      }
                    />
                  </Box>
                  {_reports.filters.hasForeignCountry === true && (
                    <SelectCountries
                      label={m.foreignCountry}
                      fullWidth
                      value={_reports.filters.companyCountries}
                      onChange={companyCountries =>
                        _reports.updateFilters(prev => ({
                          ...prev,
                          companyCountries,
                        }))
                      }
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: '8px',
                  }}
                >
                  <Box>{m.consoAnonyme}</Box>
                  <TrueFalseNull
                    value={invertIfDefined(_reports.filters.contactAgreement ?? null)}
                    onChange={contactAgreement =>
                      _reports.updateFilters(prev => ({
                        ...prev,
                        contactAgreement: invertIfDefined(contactAgreement) ?? undefined,
                      }))
                    }
                    sx={{mt: 1}}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: '8px',
                  }}
                >
                  <Box>{m.hasAttachement}</Box>
                  <TrueFalseNull
                    value={_reports.filters.hasAttachment ?? null}
                    onChange={hasAttachment =>
                      _reports.updateFilters(prev => ({
                        ...prev,
                        hasAttachment: hasAttachment ?? undefined,
                      }))
                    }
                    sx={{mt: 1}}
                  />
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </PanelBody>
        <Box
          sx={{
            flexWrap: 'wrap',
            whiteSpace: 'nowrap',
            mt: 2,
            mr: 3,
            ml: 3,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ScButton onClick={_ => setExpanded(prev => !prev)}>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <span>Recherche avancée&nbsp;</span>
              <ExpandMore expand={expanded} />
            </span>
          </ScButton>
          <Box
            sx={{
              flexWrap: 'wrap',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              '& > *': {
                mb: 1,
                ml: 1,
              },
            }}
          >
            {filtersCount !== 0 && (
              <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0}>
                <ScButton icon="clear" onClick={_reports.clearFilters} variant="outlined" color="primary">
                  {m.removeAllFilters}
                </ScButton>
              </Badge>
            )}
            <ExportReportsPopper
              disabled={ScOption.from(_reports?.list?.totalCount)
                .map(_ => _ > config.reportsLimitForExport)
                .getOrElse(false)}
              tooltipBtnNew={ScOption.from(_reports?.list?.totalCount)
                .map(_ => (_ > config.reportsLimitForExport ? m.cannotExportMoreReports(config.reportsLimitForExport) : ''))
                .getOrElse('')}
            >
              <Btn variant="outlined" color="primary" icon="get_app">
                {m.exportInXLS}
              </Btn>
            </ExportReportsPopper>
          </Box>
        </Box>
      </Panel>

      <Panel sx={{overflow: 'visible'}}>
        <Datatable
          id="reports"
          header={
            <>
              <DatatableToolbar
                open={selectReport.size > 0}
                onClear={selectReport.clear}
                actions={
                  <ScButton
                    loading={_report.download.loading}
                    variant="contained"
                    icon="file_download"
                    onClick={() => {
                      _report.download.fetch({}, selectReport.toArray())
                    }}
                    sx={{
                      marginLeft: 'auto',
                    }}
                  >
                    {m.download}
                  </ScButton>
                }
              >
                <span dangerouslySetInnerHTML={{__html: m.nSelected(selectReport.size)}} />
              </DatatableToolbar>
            </>
          }
          loading={_reports.fetching}
          paginate={{
            offset: _reports.filters.offset,
            limit: _reports.filters.limit,
            onPaginationChange: pagination => _reports.updateFilters(prev => ({...prev, ...pagination})),
          }}
          getRenderRowKey={_ => _.report.id}
          data={_reports.list?.entities}
          total={_reports.list?.totalCount}
          showColumnsToggle={true}
          columns={[
            {
              id: 'checkbox',
              head: (() => {
                const allChecked = selectReport.size === _reports.list?.entities.length
                return (
                  <Checkbox
                    disabled={_reports.fetching}
                    indeterminate={selectReport.size > 0 && !allChecked}
                    checked={allChecked}
                    onChange={() => {
                      if (allChecked) {
                        selectReport.clear()
                      } else {
                        selectReport.add(_reports.list!.entities!.map(_ => _.report.id))
                      }
                    }}
                  />
                )
              })(),
              style: {width: 0},
              render: _ => <Checkbox checked={selectReport.has(_.report.id)} onChange={() => selectReport.toggle(_.report.id)} />,
            },
            {
              id: 'companyPostalCode',
              head: m.postalCodeShort,
              sx: _ => ({
                maxWidth: 76,
              }),
              render: _ => (
                <>
                  <span>{_.report.companyAddress.postalCode?.slice(0, 2)}</span>
                  <Box component="span" sx={{color: t => t.palette.text.disabled}}>
                    {_.report.companyAddress.postalCode?.substr(2, 5)}
                  </Box>
                </>
              ),
            },
            {
              id: 'companyName',
              head: m.company,
              sx: _ => ({
                lineHeight: 1.4,
                maxWidth: 170,
              }),
              render: _ => (
                <>
                  <Box component="span" sx={{fontWeight: 'bold', marginBottom: '-1px'}}>
                    <NavLink to={siteMap.logged.company(_.report.companyId)}>
                      <Txt link>{_.report.companyName}</Txt>
                    </NavLink>
                  </Box>
                  <br />
                  <Box
                    component="span"
                    sx={{
                      fontSize: t => styleUtils(t).fontSize.small,
                      color: t => t.palette.text.disabled,
                    }}
                  >
                    {_.report.websiteURL ? getHostFromUrl(_.report.websiteURL) : _.report.phone ?? ''}
                  </Box>
                </>
              ),
            },
            {
              id: 'companySiret',
              head: m.siret,
              render: _ => (
                <>
                  <NavLink to={siteMap.logged.company(_.report.companyId)}>
                    <Txt link sx={{fontWeight: 'bold', marginBottom: '-1px'}}>
                      {_.report.companySiret}
                    </Txt>
                  </NavLink>
                </>
              ),
            },
            {
              id: 'companyCountry',
              head: m.country,
              render: _ => _.report.companyAddress.country,
            },
            {
              id: 'category',
              head: m.problem,
              sx: _ => ({
                maxWidth: 200,
              }),
              render: _ => (
                <Tooltip
                  title={
                    <>
                      <b>{m.ReportCategoryDesc[_.report.category]}</b>
                      <Box component="ul" sx={{m: 0, p: 2}}>
                        {_.report.subcategories.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </Box>
                    </>
                  }
                >
                  <span>{m.ReportCategoryDesc[_.report.category]}</span>
                </Tooltip>
              ),
            },
            {
              id: 'creationDate',
              head: m.creation,
              render: _ => formatDate(_.report.creationDate),
            },
            {
              id: 'reportDate',
              head: 'Date constat',
              render: _ => getReportingDate(_.report),
            },
            {
              id: 'details',
              head: m.details,
              sx: _ => ({
                fontSize: t => styleUtils(t).fontSize.small,
                color: t => t.palette.text.secondary,
                maxWidth: 200,
                minWidth: 200,
                lineHeight: 1.4,
                whiteSpace: 'initial',
              }),
              render: _ => <ReportDetailValues input={_.report.details} lines={2} />,
            },
            {
              id: 'tags',
              head: m.tags,
              render: _ =>
                _.report.tags.map(tag => (
                  <Chip
                    key={tag}
                    size="small"
                    variant="outlined"
                    label={m.reportTagDesc[tag]}
                    sx={{
                      fontWeight: t => t.typography.fontWeightBold,
                      color: t => t.palette.text.secondary,
                    }}
                    style={{marginRight: 2}}
                  />
                )),
            },
            {
              id: 'status',
              head: m.status,
              render: _ => <ReportStatusLabel dense status={_.report.status} />,
            },
            {
              id: 'email',
              head: m.consumer,
              sx: _ => ({
                maxWidth: 160,
              }),
              render: _ => (
                <span>
                  <Box
                    component="span"
                    sx={{
                      ...(_.report.contactAgreement
                        ? {
                            color: t => t.palette.success.light,
                          }
                        : {
                            color: t => t.palette.error.main,
                          }),
                    }}
                  >
                    {textOverflowMiddleCropping(_.report.email ?? '', 25)}
                  </Box>
                  <br />
                  <Txt color="hint" size="small">
                    {_.report.consumerPhone ?? ''}
                  </Txt>
                </span>
              ),
            },
            {
              id: 'file',
              head: m.files,
              sx: _ => ({
                minWidth: 44,
                maxWidth: 100,
              }),
              render: _ =>
                _.files.length > 0 && (
                  <Badge badgeContent={_.files.length} color="primary" invisible={_.files.length === 1}>
                    <Icon sx={{color: t => t.palette.text.disabled}}>insert_drive_file</Icon>
                  </Badge>
                ),
            },
            {
              id: 'actions',
              stickyEnd: true,
              sx: _ => sxUtils.tdActions,
              render: _ => (
                <NavLink to={siteMap.logged.report(_.report.id)}>
                  <IconBtn color="primary">
                    <Icon>chevron_right</Icon>
                  </IconBtn>
                </NavLink>
              ),
            },
          ]}
          renderEmptyState={
            <Fender
              icon={EntityIcon.report}
              title={m.noReportsTitle}
              description={
                <>
                  <Txt color="hint" size="big" block gutterBottom>
                    {m.noReportsDesc}
                  </Txt>
                  <ScButton icon="clear" onClick={_reports.clearFilters} variant="contained" color="primary">
                    {m.removeAllFilters}
                  </ScButton>
                </>
              }
            />
          }
        />
      </Panel>
    </Page>
  )
}
