import {Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Theme} from '@mui/material'
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
import Autocomplete from '@mui/lab/Autocomplete/Autocomplete'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {TrueFalseUndefined} from '../../shared/TrueFalseUndefined/TrueFalseUndefined'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'

export interface ReportsFiltersProps {
  updateFilters: (_: Partial<ReportSearch>) => void
  children: ReactElement<any>
  filters: ReportSearch
}

export interface RowProps {
  label: string | ReactNode
  children: ReactNode
}

export interface RowExtraProps {
  children: ReactNode
}

export const DialogInputRow = ({label, children}: RowProps) => {
  const useRowStyles = makeStyles((t: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 50,
      color: t.palette.text.secondary,
      minWidth: 160,
    },
    content: {
      maxWidth: 240,
      width: '100%',
      minHeight: 50,
      flex: 1,
      overflow: 'hidden',
    },
  }))
  const css = useRowStyles()
  return (
    <div className={css.root}>
      <div className={css.label}>{label}</div>
      <div className={css.content}>{children}</div>
    </div>
  )
}

const RowExtra = ({children}: RowExtraProps) => {
  const useStyles = makeStyles((t: Theme) => ({
    root: {
      paddingBottom: t.spacing(2),
      marginBottom: t.spacing(2),
      borderBottom: `1px solid ${t.palette.divider}`,
    },
  }))
  const css = useStyles()
  return (
    <div className={css.root}>
      {children}
    </div>
  )
}

const useStyles = makeStyles((t: Theme) => ({
  optionalInput: {},
}))

export const ReportFilters = ({filters, ...props}: ReportsFiltersProps) => {
  const rationalizeFilters = (f: ReportSearch): ReportSearch => ({
    ...f,
    hasWebsite: f.websiteURL && f.websiteURL !== '' ? true : f.hasWebsite,
    hasPhone: f.phone && f.phone !== '' ? true : f.hasPhone,
    hasForeignCountry: (f.companyCountries ?? []).length > 0 ? true : f.hasForeignCountry,
    hasCompany: (f.siretSirenList ?? []).length > 0 ? true : f.hasCompany,
  })
  return (
    <ReportFiltersMapped filters={rationalizeFilters(filters)} {...props}/>
  )
}

const ReportFiltersMapped = ({filters, updateFilters, children}: ReportsFiltersProps) => {
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
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
              <DialogInputRow label={m.keywords}>
                <ScInput fullWidth {...register('details')} defaultValue={filters.details ?? ''}/>
              </DialogInputRow>
              <DialogInputRow label={m.codeNaf}>
                <Controller
                  name="activityCodes"
                  defaultValue={filters.activityCodes ?? []}
                  control={control}
                  render={({field}) => (
                    <SelectActivityCode
                      {...field}
                      fullWidth
                      onChange={(e, value) => field.onChange(value)}
                    />
                  )}
                />
              </DialogInputRow>
              <DialogInputRow label={m.categories}>
                <ScSelect small fullWidth {...register('category')} defaultValue={filters.category ?? []}>
                  <MenuItem value="">&nbsp;</MenuItem>
                  {_category?.entity.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </ScSelect>
              </DialogInputRow>
              <DialogInputRow label={m.tags}>
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
              </DialogInputRow>
              <DialogInputRow label={m.status}>
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
              </DialogInputRow>
              <DialogInputRow label={m.identifiedCompany}>
                <Controller
                  name="hasCompany"
                  defaultValue={filters.hasCompany}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined className={cssUtils.marginTop} {...field}/>
                  )}
                />
                {watch('hasCompany') === true && (
                  <RowExtra>
                    <ScInput className={css.optionalInput} label={m.siret} fullWidth {...register('siretSirenList')} defaultValue={filters.siretSirenList ?? ''}/>
                  </RowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.website}>
                <Controller
                  name="hasWebsite"
                  defaultValue={filters.hasWebsite}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined className={cssUtils.marginTop} {...field}/>
                  )}
                />
                {watch('hasWebsite') === true && (
                  <RowExtra>
                    <ScInput label={m.url} fullWidth className={css.optionalInput} {...register('websiteURL')} defaultValue={filters.websiteURL ?? ''}/>
                  </RowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.phone}>
                <Controller
                  name="hasPhone"
                  defaultValue={filters.hasPhone}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined className={cssUtils.marginTop} {...field}/>
                  )}
                />
                {watch('hasPhone') === true && (
                  <RowExtra>
                    <ScInput label={m.phone} fullWidth className={css.optionalInput} {...register('phone')} defaultValue={filters.phone ?? ''}/>
                  </RowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.foreignCountry}>
                <Controller
                  name="hasForeignCountry"
                  defaultValue={filters.hasForeignCountry}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined className={cssUtils.marginTop} {...field}/>
                  )}
                />
                {watch('hasForeignCountry') === true && (
                  <RowExtra>
                    <Controller
                      name="companyCountries"
                      defaultValue={filters.companyCountries ?? []}
                      control={control}
                      render={({field}) => <SelectCountries label={m.foreignCountry} fullWidth className={css.optionalInput} {...field} />}
                    />
                  </RowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.emailConsumer}>
                <ScInput fullWidth {...register('email')} defaultValue={filters.email ?? ''}/>
              </DialogInputRow>
            </DialogContent>
            <DialogActions>
              <Btn onClick={close} color="primary">
                {m.close}
              </Btn>
              <Btn onClick={confirm} color="primary" variant="contained">
                {m.search}
              </Btn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
