import React, {ReactElement, useState} from 'react'
import {WebsiteWithCompanySearch} from "@signal-conso/signalconso-api-sdk-js/lib/model";
import {useLayoutContext} from "../../core/Layout/LayoutContext";
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {useI18n} from "../../core/i18n";
import {IdentificationStatus} from "@signal-conso/signalconso-api-sdk-js";
import {ScMenuItem} from "../MenuItem/MenuItem";
import {DialogInputRow} from "../../shared/DialogInputRow/DialogInputRow";
import {Controller, useForm} from "react-hook-form";
import {ScMultiSelect} from "../../shared/Select/MultiSelect";
import {Enum} from "@alexandreannic/ts-utils/lib/common/enum/Enum";
import {Label} from "../../shared/Label/Label";
import {Btn} from "mui-extension";


export interface WebsitesFiltersProps {
  updateFilters: (_: WebsiteWithCompanySearch) => void
  filters: WebsiteWithCompanySearch
  children: ReactElement<any>
}

interface Form extends WebsiteWithCompanySearch {
}

export const WebsitesFilters = ({filters, updateFilters, children, ...props}: WebsitesFiltersProps) => {
  const {m} = useI18n()
  const [open, setOpen] = useState<boolean>(false)
  const close = () => {
    setOpen(false)
  }

  const confirm = (e: any) => {
    close()
    handleSubmit(updateFilters)(e)
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
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
      <Dialog fullScreen={layout.isMobileWidth} open={open ?? false} onClose={close}>
        <DialogTitle>{m.search}</DialogTitle>
        <DialogContent>
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
                  renderValue={identificationStatus => `(${identificationStatus.length}) ${identificationStatus.map(status => m.IdentificationStatusDesc[status]).join(',')}`}
                >
                  {Enum.values(IdentificationStatus).map(kind => (
                    <ScMenuItem withCheckbox key={kind} value={kind}>
                      <Label {...props}>
                        {m.IdentificationStatusDesc[kind]}
                      </Label>
                    </ScMenuItem>
                  ))}
                </ScMultiSelect>
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
