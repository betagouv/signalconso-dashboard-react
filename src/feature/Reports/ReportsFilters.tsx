import {Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, makeStyles, MenuItem, Radio, RadioGroup, Theme} from '@material-ui/core'
import {useI18n} from '../../core/i18n'
import React, {ReactElement, ReactNode, useEffect, useState} from 'react'
import {ReportFilter, ReportTag} from '@signalconso/signalconso-api-sdk-js/build'
import {Controller, useForm} from 'react-hook-form'
import {useConstantContext} from '../../core/context/ConstantContext'
import {fromNullable} from 'fp-ts/lib/Option'
import {ScSelect} from '../../shared/Select/Select'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Btn} from 'mui-extension/lib'
import {ScInput} from '../../shared/Input/ScInput'
import {useAnomalyContext} from '../../core/context/AnomalyContext'

export interface ReportsFiltersProps {
  updateFilters: (_: Partial<ReportFilter>) => void
  children: ReactElement<any>
  filters: ReportFilter
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
  }
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
  const {register, handleSubmit, control, formState: {errors}} = useForm<ReportFilter>()
  const {reportStatus: _reportStatus} = useConstantContext()
  const [open, setOpen] = useState<boolean>(false)
  const {category: _category} = useAnomalyContext()

  const confirm = () => {
    updateFilters({})
    setOpen(false)
  }

  useEffect(() => {
    _reportStatus.fetch()()
    _category.fetch()()
  }, [])

  console.log(fromNullable(filters.hasCompany).map(_ => '' + _).getOrElse('x'))
  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        }
      })}
      <Dialog open={open ?? false} onClose={confirm} aria-labelledby="form-dialog-title">
        <DialogTitle>Subscribe</DialogTitle>
        {_reportStatus.entity && _category.entity && (
          <>
            <DialogContent>
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
                <ScSelect small fullWidth {...register('status')} defaultValue={filters.status ?? ''}>
                  <MenuItem value=""></MenuItem>
                  {_reportStatus.entity.map(status =>
                    <MenuItem key={status} value={status}>
                      <ReportStatusChip dense fullWidth status={status}/>
                    </MenuItem>
                  )}
                </ScSelect>
              </Row>
              {/*<Row label={m.status}>*/}
              {/*  <Controller control={control} name="status" defaultValue={''} render={({field: ?? '' {ref, ...props}}) =>*/}
              {/*    <ScSelect inputRef={ref} {...props}>*/}
              {/*      {reportStatus.map(status =>*/}
              {/*        <MenuItem key={status} value={status}>*/}
              {/*          <ReportStatusChip dense fullWidth status={status}/>*/}
              {/*        </MenuItem>*/}
              {/*      )}*/}
              {/*    </ScSelect>*/}
              {/*  }/>*/}
              {/*</Row>*/}
              <Row label={m.tags}>
                <ScSelect multiple small fullWidth {...register('tags')} defaultValue={filters.tags ?? []}>
                  <MenuItem value=""></MenuItem>
                  {Object.values(ReportTag).map(tag =>
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  )}
                </ScSelect>
              </Row>
              <Row label={m.keywords}>
                <ScInput small fullWidth {...register('details')} defaultValue={filters.details ?? ''}/>
              </Row>
              <Row label={m.categories}>
                <ScSelect small fullWidth {...register('category')} defaultValue={filters.category ?? []}>
                  <MenuItem value=""></MenuItem>
                  {_category?.entity.map(category =>
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  )}
                </ScSelect>
              </Row>
              <Row label={m.foreignCountry}>
                <ScInput small fullWidth {...register('companyCountries')} defaultValue={filters.companyCountries ?? ''}/>
              </Row>
              <Row label={m.identifiedCompany}>
                <Controller name="hasCompany" defaultValue={filters.hasCompany} control={control} render={({field}) =>
                  <RadioGroup style={{flexDirection: 'row'}} {...field}>
                    <FormControlLabel control={<Radio/>} label={m.yes} value="true"/>
                    <FormControlLabel control={<Radio/>} label={m.no} value="false"/>
                    <FormControlLabel control={<Radio/>} label={m.indifferent} value=""/>
                  </RadioGroup>
                }></Controller>

                {/*// <RadioGroup style={{flexDirection: 'row'}}>*/}
                {/*//   <FormControlLabel control={<Radio inputRef={register('hasCompany') as any}/>} value={true} label={m.yes}/>*/}
                {/*//   <FormControlLabel control={<Radio inputRef={register('hasCompany') as any}/>} value={false} label={m.no}/>*/}
                {/*//   <FormControlLabel control={<Radio inputRef={register('hasCompany') as any}/>} value={undefined} label={m.indifferent}/>*/}
                {/*// </RadioGroup>*/}
              </Row>
            </DialogContent>
            <DialogActions>
              <Btn onClick={confirm} color="primary">
                Cancel
              </Btn>
              <Btn onClick={handleSubmit(updateFilters)} color="primary">
                Subscribe
              </Btn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}
