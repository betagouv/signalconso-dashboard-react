import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'
import React, {ReactElement, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Controller, useForm} from 'react-hook-form'
import {cleanObject, CompanySearch} from '@signal-conso/signalconso-api-sdk-js'
import {Btn} from 'mui-extension'
import {DialogInputRow} from '../Reports/ReportsFilters'
import {ScInput} from '../../shared/Input/ScInput'

export interface CompaniesRegisteredFiltersProps {
  updateFilters: (_: Partial<CompanySearch>) => void
  children: ReactElement<any>
  filters: CompanySearch
}

export const CompaniesRegisteredFilters = ({updateFilters, children, filters}: CompaniesRegisteredFiltersProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const cssUtils = useCssUtils()
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<CompanySearch>()

  const close = () => {
    setOpen(false)
  }

  const confirm = (e: any) => {
    close()
    handleSubmit(_ => updateFilters(cleanObject(_)))(e)
  }

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
        <DialogContent>
          <DialogInputRow label={m.departments}>
            <Controller
              name="departments"
              defaultValue={filters.departments}
              control={control}
              render={({field}) => (
                <SelectDepartments
                  {...field}
                  fullWidth
                  className={cssUtils.marginRight}
                />
              )}
            />
          </DialogInputRow>
          <DialogInputRow label={m.codeNaf}>
            <Controller
              name="activityCodes"
              defaultValue={filters.activityCodes}
              control={control}
              render={({field}) => (
                <SelectActivityCode
                  fullWidth
                  value={field.value}
                  onChange={(a, b) => field.onChange(b)}
                />
              )}
            />
          </DialogInputRow>
          <DialogInputRow label={m.email}>
            <ScInput fullWidth {...register('emailsWithAccess')} defaultValue={filters.emailsWithAccess ?? ''}/>
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
      </Dialog>
    </>
  )
}
