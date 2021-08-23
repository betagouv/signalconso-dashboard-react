import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Theme,
} from '@material-ui/core'
import {useI18n} from '../../core/i18n'
import React, {ReactElement, ReactNode, useEffect, useState} from 'react'
import {ReportSearch, ReportTag} from 'core/api'
import {Controller, useForm} from 'react-hook-form'
import {useConstantContext} from '../../core/context/ConstantContext'
import {ScSelect} from '../../shared/Select/Select'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Btn} from 'mui-extension/lib'
import {ScInput} from '../../shared/Input/ScInput'
import {useAnomalyContext} from '../../core/context/AnomalyContext'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import {Autocomplete} from '@material-ui/lab'
import {Enum} from '@alexandreannic/ts-utils/lib/enum/Enum'

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
    setValue,
    control,
    formState: {errors},
  } = useForm<ReportSearch>()
  const {reportStatus: _reportStatus} = useConstantContext()
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
    _reportStatus.fetch({force: false})
    _category.fetch({force: false})
  }, [])

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        },
      })}
      <Dialog open={open ?? false} onClose={close}>
        <DialogTitle>{m.search}</DialogTitle>
        {_reportStatus.entity && _category.entity && (
          <>
            <DialogContent>
              <Row label={m.website}>
                <ScInput small fullWidth {...register('websiteURL')} defaultValue={filters.websiteURL ?? ''} />
              </Row>
              <Row label={m.phone}>
                <ScInput small fullWidth {...register('phone')} defaultValue={filters.phone ?? ''} />
              </Row>
              <Row label={m.siret}>
                <ScInput small fullWidth {...register('siretSirenList')} defaultValue={filters.siretSirenList ?? ''} />
              </Row>
              <Row label={m.emailConsumer}>
                <ScInput small fullWidth {...register('email')} defaultValue={filters.email ?? ''} />
              </Row>
              <Row label={m.status}>
                <ScSelect small fullWidth {...register('status')} defaultValue={filters.status ?? ''}>
                  <MenuItem value="">&nbsp;</MenuItem>
                  {_reportStatus.entity.map(status => (
                    <MenuItem key={status} value={status}>
                      <ReportStatusChip inSelectOptions dense fullWidth status={status} />
                    </MenuItem>
                  ))}
                </ScSelect>
              </Row>
              <Row label={m.tags}>
                <Controller
                  name="tags"
                  defaultValue={filters.tags ?? []}
                  control={control}
                  render={({field}) => (
                    <Autocomplete
                      multiple
                      {...field}
                      onChange={(e, value) => field.onChange(value)}
                      options={Enum.values(ReportTag)}
                      style={{width: 300}}
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
