import {
  Autocomplete,
  Box,
  Breadcrumbs,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  MenuItem,
  Typography,
} from '@mui/material'
import {useI18n} from '../../core/i18n'
import React, {ReactElement, useEffect, useMemo, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {ScSelect} from '../../shared/Select/Select'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import {ScInput} from '../../shared/Input/ScInput'
import {Enum} from '../../alexlibs/ts-utils'
import {TrueFalseNull} from '../../shared/TrueFalseUndefined/TrueFalseNull'
import {SelectCountries} from '../../shared/SelectCountries/SelectCountries'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'
import {ScMultiSelect} from 'shared/Select/MultiSelect'
import {ScMenuItem} from '../../shared/MenuItem/ScMenuItem'
import {SelectTags} from '../../shared/SelectTags/SelectTags'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {DialogInputRow, DialogInputRowExtra} from '../../shared/DialogInputRow/DialogInputRow'
import {Btn, Fender, Txt} from '../../alexlibs/mui-extension'
import {useLayoutContext} from '../../core/Layout/LayoutContext'
import {ReportSearch} from '../../core/client/report/ReportSearch'
import {Id, ReportStatus} from '../../core/model'
import {useConstantContext} from '../../core/context/ConstantContext'
import {SavedReportsFilters} from './SavedReportsFilters'
import {NamedReportSearch} from '../../core/client/report/NamedReportSearch'

interface Props {
  updateFilters: (_: ReportSearch) => void
  filters: ReportSearch
  savedFilters: NamedReportSearch[]
  savedFiltersLoading: boolean
  saveFilters: (_: NamedReportSearch) => void
  renameFilters: (oldName: string, newName: string) => void
  deleteFilters: (_: string) => void
  setDefault: (_: string) => void
  unsetDefault: (_: string) => void
  children: ReactElement<any>
}

interface Form {
  // For some inputs, react-form can't work with undefined, so we use null
  // Yet for some other inputs, it seems we need to use undefined
  departments: string[] | null
  companyCountries: string[] | undefined
  siretSirenList: string | null
  activityCodes: string[] | undefined
  status: ReportStatus[] | undefined
  companyIds: Id[] | null
  start: Date | null
  end: Date | null
  email: string | null
  websiteURL: string | null
  phone: string | null
  category: string | null
  details: string | null
  contactAgreement: boolean | null
  hasPhone: boolean | null
  hasWebsite: boolean | null
  hasForeignCountry: boolean | null
  hasCompany: boolean | null
  hasAttachment: boolean | null
  tags: SelectTagsMenuValues
}

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

function invertIfDefined(bool: boolean | null) {
  return bool === null ? null : !bool
}

function reportSearch2Form(_: ReportSearch): Form {
  const {
    departments,
    withTags,
    withoutTags,
    companyCountries,
    siretSirenList,
    activityCodes,
    status,
    companyIds,
    start,
    end,
    email,
    websiteURL,
    phone,
    category,
    details,
    contactAgreement,
    hasPhone,
    hasWebsite,
    hasForeignCountry,
    hasCompany,
    hasAttachment,
  } = _
  const tags: SelectTagsMenuValues = {}
  withTags?.forEach(tag => {
    tags[tag] = 'included'
  })
  withoutTags?.forEach(tag => {
    tags[tag] = 'excluded'
  })
  return {
    departments: departments ?? null,
    companyCountries,
    siretSirenList: siretSirenList ? siretSirenList[0] : null,
    activityCodes,
    status,
    companyIds: companyIds ?? null,
    start: start ?? null,
    end: end ?? null,
    email: email ?? null,
    websiteURL: websiteURL ?? null,
    phone: phone ?? null,
    category: category ?? null,
    details: details ?? null,
    contactAgreement: contactAgreement ?? null,
    hasPhone: (phone && phone !== '' ? true : hasPhone) ?? null,
    hasWebsite: (websiteURL && websiteURL !== '' ? true : hasWebsite) ?? null,
    hasForeignCountry: ((companyCountries ?? []).length > 0 ? true : hasForeignCountry) ?? null,
    hasCompany: ((siretSirenList ?? []).length > 0 ? true : hasCompany) ?? null,
    hasAttachment: hasAttachment ?? null,
    tags,
  }
}

function form2ReportSearch(_: Form): ReportSearch {
  const {
    departments,
    companyCountries,
    siretSirenList,
    activityCodes,
    status,
    companyIds,
    start,
    end,
    email,
    websiteURL,
    phone,
    category,
    details,
    contactAgreement,
    hasPhone,
    hasWebsite,
    hasForeignCountry,
    hasCompany,
    hasAttachment,
    tags,
  } = _
  return {
    departments: departments ?? undefined,
    withTags: Enum.keys(tags).filter(tag => tags[tag] === 'included'),
    withoutTags: Enum.keys(tags).filter(tag => tags[tag] === 'excluded'),
    companyCountries: companyCountries,
    siretSirenList: siretSirenList ? [siretSirenList] : undefined,
    activityCodes,
    status,
    companyIds: companyIds ?? undefined,
    start: start ?? undefined,
    end: end ?? undefined,
    email: email ?? undefined,
    websiteURL: websiteURL ?? undefined,
    phone: phone ?? undefined,
    category: category ?? undefined,
    details: details ?? undefined,
    contactAgreement: contactAgreement ?? undefined,
    hasPhone: hasPhone ?? undefined,
    hasWebsite: hasWebsite ?? undefined,
    hasForeignCountry: hasForeignCountry ?? undefined,
    hasCompany: hasCompany ?? undefined,
    hasAttachment: hasAttachment ?? undefined,
  }
}

export const ReportsFilters = ({
  filters: rawFilters,
  updateFilters,
  children,
  savedFilters,
  savedFiltersLoading,
  saveFilters,
  renameFilters,
  deleteFilters,
  setDefault,
  unsetDefault,
}: Props) => {
  const {m} = useI18n()
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
  const [open, setOpen] = useState<boolean>(false)
  const [filterName, setFilterName] = useState<string>('')
  const [editFilters, setEditFilters] = useState<boolean>(false)
  const _category = useConstantContext().categories

  const filterNameAlreadyExists = savedFilters.map(_ => _.name).includes(filterName)
  const canCreateFilter = !filterNameAlreadyExists && filterName !== ''

  const close = () => {
    setOpen(false)
  }

  const save = () => {
    const form = getValues()
    const reportSearch = form2ReportSearch(form)
    return saveFilters({name: filterName, reportSearch, default: false})
  }
  const confirm = (e: any) => {
    close()
    handleSubmit((form: Form) => {
      return updateFilters(form2ReportSearch(form))
    })(e)
  }

  const triggerSearch = (e: any) => {
    //Trigger search on 'ENTER'
    if (e.keyCode === 13) {
      return confirm(e)
    }
  }

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', triggerSearch)
      return () => {
        //Makes sure event is added once https://stackoverflow.com/questions/71822354/onkeydown-onkeyup-listener-in-react
        window.removeEventListener('keydown', triggerSearch)
      }
    }
  }, [open])

  useEffect(() => {
    _category.fetch({force: false})
  }, [])

  const filters = useMemo(() => {
    return reportSearch2Form(rawFilters)
  }, [rawFilters])

  useEffect(() => {
    reset(filters)
  }, [filters])

  const selectFilterToApply = (filterName: string | null) => {
    if (filterName === null) {
      reset(reportSearch2Form(rawFilters))
    } else {
      const filters = savedFilters.find(_ => _.name === filterName)?.reportSearch ?? rawFilters
      reset(reportSearch2Form(filters))
    }
  }

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          setOpen(true)
        },
      })}
      <Dialog fullScreen={layout.isMobileWidth} open={open ?? false} onClose={close}>
        <DialogTitle>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Typography variant="h6" color="text.primary">
              {m.search}
            </Typography>
            {!editFilters || (
              <Typography variant="h6" color="text.primary">
                Gestion des filtres enregistrés
              </Typography>
            )}
          </Breadcrumbs>
        </DialogTitle>
        {editFilters ? (
          <>
            <DialogContent>
              <Txt color="hint" italic>
                Retrouvez ici vos filtres enregistrés. Vous pouvez les renommer ou les supprimer.
              </Txt>
              {savedFiltersLoading ? (
                <Box sx={{textAlign: 'center'}}>
                  <CircularProgress size={64} />
                </Box>
              ) : savedFilters.length === 0 ? (
                <Fender title="Aucun filtre enregistré" icon="sentiment_very_dissatisfied" />
              ) : (
                <SavedReportsFilters
                  filters={savedFilters}
                  onSave={renameFilters}
                  onDelete={deleteFilters}
                  setAsDefault={setDefault}
                  unsetDefault={unsetDefault}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Btn onClick={close} color="secondary">
                {m.close}
              </Btn>
              <Btn onClick={() => setEditFilters(false)} color="primary" variant="contained">
                Retour à la recherche
              </Btn>
            </DialogActions>
          </>
        ) : (
          _category.entity && (
            <>
              <DialogContent>
                <Box
                  sx={{
                    borderBottom: t => `1px solid ${t.palette.divider}`,
                    borderTop: t => `1px solid ${t.palette.divider}`,
                  }}
                >
                  <Txt color="hint" italic>
                    Choisissez un de vos filtres enregistrés pour l'appliquer ci-dessus. Cliquer sur "Gérer les filtres" pour
                    retrouver tous vos filtrer et les gérer.
                  </Txt>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Autocomplete
                      sx={{width: '50%'}}
                      disablePortal
                      onChange={(e: any, filterName: string | null) => selectFilterToApply(filterName)}
                      options={savedFilters.map(_ => _.name)}
                      renderInput={params => <ScInput {...params} label="Appliquer un filtre enregistré" />}
                    />
                    <Btn color="primary" onClick={() => setEditFilters(true)}>
                      Gérer les filtres
                    </Btn>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <ScInput
                      sx={{width: '50%'}}
                      label="Nom du filtre"
                      value={filterName}
                      error={filterNameAlreadyExists}
                      helperText={filterNameAlreadyExists ? 'Le filtre existe déjà' : ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilterName(event.target.value)}
                    />
                    <Btn onClick={save} color="primary" disabled={!canCreateFilter}>
                      {/*<Icon>save</Icon>*/}
                      Créer un filtre
                    </Btn>
                  </Box>
                </Box>
                <DialogInputRow icon="business" label={m.siretOrSirenFound}>
                  <Controller
                    name="hasCompany"
                    defaultValue={filters.hasCompany}
                    control={control}
                    render={({field}) => (
                      <TrueFalseNull
                        label={{
                          true: <TrueLabel />,
                        }}
                        sx={{mt: 1}}
                        {...field}
                      />
                    )}
                  />
                  {watch('hasCompany') === true && (
                    <DialogInputRowExtra>
                      <ScInput
                        label={m.siretOrSiren}
                        fullWidth
                        {...register('siretSirenList')}
                        defaultValue={filters.siretSirenList ?? ''}
                      />
                    </DialogInputRowExtra>
                  )}
                </DialogInputRow>
                <DialogInputRow icon="format_quote" label={m.keywords}>
                  <ScInput fullWidth {...register('details')} defaultValue={filters.details ?? ''} />
                </DialogInputRow>
                <DialogInputRow icon="label" label={m.codeNaf}>
                  <Controller
                    name="activityCodes"
                    defaultValue={filters.activityCodes ?? []}
                    control={control}
                    render={({field}) => (
                      <SelectActivityCode {...field} fullWidth onChange={(e, value) => field.onChange(value)} />
                    )}
                  />
                </DialogInputRow>
                <DialogInputRow icon="category" label={m.categories}>
                  <Controller
                    name="category"
                    defaultValue={filters.category ?? '1'}
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <ScSelect small fullWidth value={value} onChange={onChange}>
                        <MenuItem value="">&nbsp;</MenuItem>
                        {_category?.entity?.map(category => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </ScSelect>
                    )}
                  />
                </DialogInputRow>
                <DialogInputRow icon="label" label={m.tags}>
                  <Controller
                    name="tags"
                    defaultValue={filters.tags ?? {}}
                    control={control}
                    render={({field}) => <SelectTags fullWidth {...field} />}
                  />
                </DialogInputRow>
                <DialogInputRow icon="check_circle" label={m.status}>
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
                <DialogInputRow icon="language" label={m.website}>
                  <Controller
                    name="hasWebsite"
                    defaultValue={filters.hasWebsite}
                    control={control}
                    render={({field}) => (
                      <TrueFalseNull
                        {...field}
                        label={{
                          true: <TrueLabel />,
                        }}
                        sx={{mt: 1}}
                      />
                    )}
                  />
                  {watch('hasWebsite') === true && (
                    <DialogInputRowExtra>
                      <ScInput label={m.url} fullWidth {...register('websiteURL')} defaultValue={filters.websiteURL ?? ''} />
                    </DialogInputRowExtra>
                  )}
                </DialogInputRow>
                <DialogInputRow icon="phone" label={m.phone}>
                  <Controller
                    name="hasPhone"
                    defaultValue={filters.hasPhone}
                    control={control}
                    render={({field}) => (
                      <TrueFalseNull
                        {...field}
                        label={{
                          true: <TrueLabel />,
                        }}
                        sx={{mt: 1}}
                      />
                    )}
                  />
                  {watch('hasPhone') === true && (
                    <DialogInputRowExtra>
                      <ScInput label={m.phone} fullWidth {...register('phone')} defaultValue={filters.phone ?? ''} />
                    </DialogInputRowExtra>
                  )}
                </DialogInputRow>
                <DialogInputRow icon="flag" label={m.foreignCountry}>
                  <Controller
                    name="hasForeignCountry"
                    defaultValue={filters.hasForeignCountry}
                    control={control}
                    render={({field}) => (
                      <TrueFalseNull
                        {...field}
                        label={{
                          true: <TrueLabel />,
                        }}
                        sx={{mt: 1}}
                      />
                    )}
                  />
                  {watch('hasForeignCountry') === true && (
                    <DialogInputRowExtra>
                      <Controller
                        name="companyCountries"
                        defaultValue={filters.companyCountries ?? []}
                        control={control}
                        render={({field}) => <SelectCountries label={m.foreignCountry} fullWidth {...field} />}
                      />
                    </DialogInputRowExtra>
                  )}
                </DialogInputRow>
                <DialogInputRow icon="email" label={m.emailConsumer}>
                  <ScInput fullWidth {...register('email')} defaultValue={filters.email ?? ''} />
                </DialogInputRow>
                <DialogInputRow icon="person" label={m.consoAnonyme}>
                  <Controller
                    name="contactAgreement"
                    defaultValue={invertIfDefined(filters.contactAgreement)}
                    control={control}
                    render={({field: {value, onChange, ...otherField}}) => (
                      <TrueFalseNull
                        {...otherField}
                        value={invertIfDefined(value)}
                        onChange={_ => onChange(invertIfDefined(_))}
                        sx={{mt: 1}}
                      />
                    )}
                  />
                </DialogInputRow>
                <DialogInputRow icon="attach_file" label={m.hasAttachement}>
                  <Controller
                    name="hasAttachment"
                    defaultValue={filters.hasAttachment}
                    control={control}
                    render={({field}) => <TrueFalseNull {...field} sx={{mt: 1}} />}
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
            </>
          )
        )}
      </Dialog>
    </>
  )
}
