import React, {ReactElement, useEffect, useState} from 'react'
import {useLayoutContext} from '../../core/Layout/LayoutContext'
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {useI18n} from '../../core/i18n'
import {ScMenuItem} from '../MenuItem/MenuItem'
import {DialogInputRow} from '../../shared/DialogInputRow'
import {Controller, useForm} from 'react-hook-form'
import {ScMultiSelect} from '../../shared/Select/MultiSelect'
import {Enum} from '../../alexlibs/ts-utils'
import {Label} from '../../shared/Label'
import {Btn} from '../../alexlibs/mui-extension'
import {IdentificationStatus, InvestigationStatus, WebsiteWithCompanySearch} from '../../core/client/website/Website'
import {TrueFalseNull} from '../../shared/TrueFalseNull'

export interface WebsitesFiltersProps {
  updateFilters: (_: WebsiteWithCompanySearch) => void
  filters: WebsiteWithCompanySearch
  children: ReactElement<any>
}

interface Form extends WebsiteWithCompanySearch {}

export const WebsitesFilters = ({filters, updateFilters, children, ...props}: WebsitesFiltersProps) => {
  const {m} = useI18n()
  const [open, setOpen] = useState<boolean>(false)
  const close = () => {
    setOpen(false)
  }

  const TrueLabel = () => {
    const {m} = useI18n()
    return <>{m.yes}</>
  }

  const confirm = (e: any) => {
    close()
    handleSubmit(updateFilters)(e)
  }

  useEffect(() => {
    reset(filters)
  }, [filters])

  const {
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm<Form>()

  const layout = useLayoutContext()

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        },
      })}
      <Dialog maxWidth={'sm'} fullWidth fullScreen={layout.isMobileWidth} open={open ?? false} onClose={close}>
        <DialogTitle>{m.search}</DialogTitle>
        <DialogContent>
          <DialogInputRow icon="check_circle" label={m.investigation}>
            <Controller
              defaultValue={filters.investigationStatus ?? []}
              name="investigationStatus"
              control={control}
              render={({field}) => (
                <ScMultiSelect
                  {...field}
                  fullWidth
                  withSelectAll
                  renderValue={investigationStatus =>
                    `(${investigationStatus.length}) ${investigationStatus
                      .map(status => m.InvestigationStatusDesc[status])
                      .join(',')}`
                  }
                >
                  {Enum.values(InvestigationStatus).map(investigationStatus => (
                    <ScMenuItem withCheckbox key={investigationStatus} value={investigationStatus}>
                      <Label dense {...props}>
                        {m.InvestigationStatusDesc[investigationStatus]}
                      </Label>
                    </ScMenuItem>
                  ))}
                </ScMultiSelect>
              )}
            />
          </DialogInputRow>

          <DialogInputRow icon="check_circle" label={m.kind}>
            <Controller
              defaultValue={filters.identificationStatus ?? []}
              name="identificationStatus"
              control={control}
              render={({field}) => (
                <ScMultiSelect
                  {...field}
                  fullWidth
                  withSelectAll
                  renderValue={identificationStatus =>
                    `(${identificationStatus.length}) ${identificationStatus
                      .map(status => m.IdentificationStatusDesc[status])
                      .join(',')}`
                  }
                >
                  {Enum.values(IdentificationStatus).map(kind => (
                    <ScMenuItem withCheckbox key={kind} value={kind}>
                      <Label dense {...props}>
                        {m.IdentificationStatusDesc[kind]}
                      </Label>
                    </ScMenuItem>
                  ))}
                </ScMultiSelect>
              )}
            />
          </DialogInputRow>

          <DialogInputRow icon="check_circle" label={'Établissement ouvert'}>
            <Controller
              defaultValue={null}
              name="isOpen"
              control={control}
              render={({field}) => (
                <TrueFalseNull
                  {...field}
                  label={{
                    true: <TrueLabel />,
                  }}
                  sx={{flexBasis: '100%', mt: 1}}
                />
              )}
            />
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
