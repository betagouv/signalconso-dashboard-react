import {Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Radio, RadioGroup, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useI18n} from '../../core/i18n'
import React, {ReactElement, ReactNode, useEffect, useState} from 'react'
import {ReportSearch, ReportStatus, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {Controller, useForm} from 'react-hook-form'
import {ScSelect} from '../../shared/Select/Select'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import {Btn} from 'mui-extension/lib'
import {ScInput} from '../../shared/Input/ScInput'
import {useAnomalyContext} from '../../core/context/AnomalyContext'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import Autocomplete from '@mui/lab/Autocomplete/Autocomplete'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'

export interface ReportsFiltersProps {
  updateFilters: (_: Partial<ReportSearch>) => void
  children: ReactElement<any>
  filters: ReportSearch
}

export interface RowProps {
  label: string | ReactNode
  children: any
}

const useRowStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    color: t.palette.text.secondary,
    minWidth: 160,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
}))

const Row = ({label, children}: RowProps) => {
  const css = useRowStyles()
  return (
    <div className={css.root}>
      <div className={css.label}>{label}</div>
      <div className={css.content}>{children}</div>
    </div>
  )
}

export const ReportFilters = ({filters, updateFilters, children}: ReportsFiltersProps) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: {errors},
  } = useForm<ReportSearch>()
  const [open, setOpen] = useState<boolean>(false)
  const {category: _category} = useAnomalyContext()

  const close = () => {
    setOpen(false)
  }

  const confirm = (e: any) => {
    close()
    handleSubmit(updateFilters)(e)
  }

  useEffect(() => {
    _category.fetch({force: false})
  }, [])

  useEffect(() => {
    reset(filters)
  }, [filters])

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        },
      })}
      <Dialog open={open ?? false} onClose={close}>
        <DialogTitle>{m.search}</DialogTitle>
        {_category.entity && (
          <>
            <DialogContent>
              <Row label={m.codeNaf}>
                <Controller
                  name="activityCodes"
                  defaultValue={filters.activityCodes ?? []}
                  control={control}
                  render={({field}) => (
                    <SelectActivityCode
                      {...field}
                      onChange={(e, value) => field.onChange(value)}
                      fullWidth
                    />
                  )}
                />
              </Row>
              <Row label={m.website}>
                <ScInput small fullWidth {...register('websiteURL')} defaultValue={filters.websiteURL ?? ''}/>
              </Row>
              <Row label={m.phone}>
                <ScInput small fullWidth {...register('phone')} defaultValue={filters.phone ?? ''}/>
              </Row>
              <Row label={m.siret}>
                <ScInput small fullWidth {...register('siretSirenList')} defaultValue={filters.siretSirenList ?? ''}/>
              </Row>
              <Row label={m.emailConsumer}>
                <ScInput small fullWidth {...register('email')} defaultValue={filters.email ?? ''}/>
              </Row>
              <Row label={m.status}>
                <Controller defaultValue={filters.status ?? []} name="status" control={control} render={({field}) => (
                  <ScSelect
                    {...field} multiple fullWidth
                    renderValue={status => `(${status.length}) ${status.map(_ => m.reportStatusShort[_]).join(',')}`}
                  >
                    {Enum.values(ReportStatus).map(status => (
                      <MenuItem key={status} value={status}>
                        <Checkbox
                          size="small" style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}
                          checked={(getValues().status ?? []).includes(status)}
                        />
                        <ReportStatusLabel inSelectOptions dense fullWidth status={status}/>
                      </MenuItem>
                    ))}
                  </ScSelect>
                )}/>
              </Row>
              <Row label={m.tags}>
                <Controller
                  name="tags"
                  defaultValue={filters.tags ?? []}
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      fullWidth
                      multiple
                      {...field}
                      onChange={(e, value) => field.onChange(value)}
                      options={Enum.values(ReportTag)}
                      renderTags={(value, getTagProps) =>
                        value.map((option: string, index: number) => (
                          <Chip size="small" variant="outlined" label={option} {...getTagProps({index})} />
                        ))
                      }
                      renderInput={params => <ScInput {...params} />}
                    />
                  )}
                />
              </Row>
              <Row label={m.keywords}>
                <ScInput small fullWidth {...register('details')} defaultValue={filters.details ?? ''} />
              </Row>
              <Row label={m.categories}>
                <ScSelect small fullWidth {...register('category')} defaultValue={filters.category ?? []}>
                  <MenuItem value="">&nbsp;</MenuItem>
                  {_category?.entity.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </ScSelect>
              </Row>
              <Row label={m.foreignCountry}>
                <Controller
                  name="companyCountries"
                  defaultValue={filters.companyCountries ?? []}
                  control={control}
                  render={({field}) => <SelectCountries fullWidth {...field} />}
                />
              </Row>
              <Row label={m.identifiedCompany}>
                <Controller
                  name="hasCompany"
                  defaultValue={filters.hasCompany}
                  control={control}
                  render={({field}) => (
                    <RadioGroup
                      {...field}
                      style={{flexDirection: 'row'}}
                      value={(() => {
                        if ([true, 'true'].includes(field.value as any)) return 'true'
                        if ([false, 'false'].includes(field.value as any)) return 'false'
                        return ''
                      })()}
                      onChange={e => {
                        const valueAsBoolean = {true: true, false: false}[e.target.value]
                        field.onChange(valueAsBoolean)
                      }}
                    >
                      <FormControlLabel control={<Radio />} label={m.yes} value="true" />
                      <FormControlLabel control={<Radio />} label={m.no} value="false" />
                      <FormControlLabel control={<Radio />} label={m.indifferent} value="" />
                    </RadioGroup>
                  )}
                />
              </Row>
            </DialogContent>
            <DialogActions>
              <Btn onClick={close} color="primary">
                {m.close}
              </Btn>
              <Btn onClick={confirm} color="primary">
                {m.search}
              </Btn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
