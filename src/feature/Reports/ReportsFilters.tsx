import {Dialog, DialogActions, DialogContent, DialogTitle, Icon, MenuItem} from '@mui/material'
import {useI18n} from '../../core/i18n'
import React, {ReactElement, useEffect, useState} from 'react'
import {ReportSearch, ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import {Controller, useForm} from 'react-hook-form'
import {ScSelect} from '../../shared/Select/Select'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import {Btn} from 'mui-extension/lib'
import {ScInput} from '../../shared/Input/ScInput'
import {useAnomalyContext} from '../../core/context/AnomalyContext'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {TrueFalseUndefined} from '../../shared/TrueFalseUndefined/TrueFalseUndefined'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {ScMultiSelect} from 'shared/Select/MultiSelect'
import {ScMenuItem} from '../../shared/MenuItem/ScMenuItem'
import {SelectTags} from '../../shared/SelectTags/SelectTags'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {DialogInputRow, DialogInputRowExtra} from '../../shared/DialogInputRow/DialogInputRow'
import compose from '../../core/helper/compose'

export interface ReportsFiltersProps {
  updateFilters: (_: ReportSearch) => void
  filters: ReportSearch
  children: ReactElement<any>
}

export interface _ReportsFiltersProps {
  updateFilters: (_: Form) => void
  filters: Form
  children: ReactElement<any>
}

interface Form extends Omit<ReportSearch, 'withTags' | 'withoutTags'> {
  tags: SelectTagsMenuValues
}

const rationalizeFilters = (f: ReportSearch): ReportSearch => ({
  ...f,
  hasWebsite: f.websiteURL && f.websiteURL !== '' ? true : f.hasWebsite,
  hasPhone: f.phone && f.phone !== '' ? true : f.hasPhone,
  hasForeignCountry: (f.companyCountries ?? []).length > 0 ? true : f.hasForeignCountry,
  hasCompany: (f.siretSirenList ?? []).length > 0 ? true : f.hasCompany,
})

export const toReportTagValues = <T extends Pick<ReportSearch, 'withTags' | 'withoutTags'>>(filters: T): T & {tags: SelectTagsMenuValues} => {
  const tags: SelectTagsMenuValues = {}
  filters.withTags?.forEach(tag => {
    tags[tag] = 'included'
  })
  filters.withoutTags?.forEach(tag => {
    tags[tag] = 'excluded'
  })
  return {...filters, tags}
}

export const fromReportTagValues = (tags: SelectTagsMenuValues): Pick<ReportSearch, 'withTags' | 'withoutTags'> => {
  return {
    withTags: Enum.keys(tags).filter(tag => tags[tag] === 'included'),
    withoutTags: Enum.keys(tags).filter(tag => tags[tag] === 'excluded'),
  }
}

export const ReportFilters = ({filters, updateFilters, ...props}: ReportsFiltersProps) => {
  return (
    <_ReportsFilters
      {...props}
      filters={compose(toReportTagValues, rationalizeFilters)(filters)}
      updateFilters={form => updateFilters({
        ...form,
        ...fromReportTagValues(form.tags),
      })}
    />
  )
}

const _ReportsFilters = ({filters, updateFilters, children}: _ReportsFiltersProps) => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState: {errors},
  } = useForm<Form>()
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
              <DialogInputRow
                label={
                  <>
                    <div>{m.identifiedCompany}</div>
                    <Txt size="small" color="disabled" block style={{marginTop: -14}}>
                      ({m.siret})
                    </Txt>
                  </>
                }
              >
                <Controller
                  name="hasCompany"
                  defaultValue={filters.hasCompany}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined
                      label={{
                        true: (
                          <>
                            {m.yes} <Icon fontSize="inherit">arrow_drop_down</Icon>
                          </>
                        ),
                      }}
                      className={cssUtils.marginTop}
                      {...field}
                    />
                  )}
                />
                {watch('hasCompany') === true && (
                  <DialogInputRowExtra>
                    <ScInput
                      label={m.siret}
                      fullWidth
                      {...register('siretSirenList')}
                      defaultValue={filters.siretSirenList ?? ''}
                    />
                  </DialogInputRowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.keywords}>
                <ScInput fullWidth {...register('details')} defaultValue={filters.details ?? ''} />
              </DialogInputRow>
              <DialogInputRow label={m.codeNaf}>
                <Controller
                  name="activityCodes"
                  defaultValue={filters.activityCodes ?? []}
                  control={control}
                  render={({field}) => <SelectActivityCode {...field} fullWidth onChange={(e, value) => field.onChange(value)} />}
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
                  defaultValue={filters.tags ?? {}}
                  control={control}
                  render={({field}) => (
                    <SelectTags {...field}/>
                  )}
                />
              </DialogInputRow>
              <DialogInputRow label={m.status}>
                <Controller
                  defaultValue={filters.status ?? []}
                  name="status"
                  control={control}
                  render={({field}) => (
                    <ScMultiSelect
                      {...field}
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
                  )}
                />
              </DialogInputRow>
              <DialogInputRow label={m.website}>
                <Controller
                  name="hasWebsite"
                  defaultValue={filters.hasWebsite}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined
                      {...field}
                      label={{
                        true: (
                          <>
                            {m.yes} <Icon fontSize="inherit">arrow_drop_down</Icon>
                          </>
                        ),
                      }}
                      className={cssUtils.marginTop}
                    />
                  )}
                />
                {watch('hasWebsite') === true && (
                  <DialogInputRowExtra>
                    <ScInput
                      label={m.url}
                      fullWidth
                      {...register('websiteURL')}
                      defaultValue={filters.websiteURL ?? ''}
                    />
                  </DialogInputRowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.phone}>
                <Controller
                  name="hasPhone"
                  defaultValue={filters.hasPhone}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined
                      {...field}
                      label={{
                        true: (
                          <>
                            {m.yes} <Icon fontSize="inherit">arrow_drop_down</Icon>
                          </>
                        ),
                      }}
                      className={cssUtils.marginTop}
                    />
                  )}
                />
                {watch('hasPhone') === true && (
                  <DialogInputRowExtra>
                    <ScInput
                      label={m.phone}
                      fullWidth
                      {...register('phone')}
                      defaultValue={filters.phone ?? ''}
                    />
                  </DialogInputRowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.foreignCountry}>
                <Controller
                  name="hasForeignCountry"
                  defaultValue={filters.hasForeignCountry}
                  control={control}
                  render={({field}) => (
                    <TrueFalseUndefined
                      {...field}
                      label={{
                        true: (
                          <>
                            {m.yes} <Icon fontSize="inherit">arrow_drop_down</Icon>
                          </>
                        ),
                      }}
                      className={cssUtils.marginTop}
                    />
                  )}
                />
                {watch('hasForeignCountry') === true && (
                  <DialogInputRowExtra>
                    <Controller
                      name="companyCountries"
                      defaultValue={filters.companyCountries ?? []}
                      control={control}
                      render={({field}) => (
                        <SelectCountries label={m.foreignCountry} fullWidth {...field} />
                      )}
                    />
                  </DialogInputRowExtra>
                )}
              </DialogInputRow>
              <DialogInputRow label={m.emailConsumer}>
                <ScInput fullWidth {...register('email')} defaultValue={filters.email ?? ''} />
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
