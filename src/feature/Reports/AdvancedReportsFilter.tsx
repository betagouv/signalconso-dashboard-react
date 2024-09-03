import { Box, Grid, Icon, MenuItem } from '@mui/material'
import { Category } from '../../core/client/constant/Category'
import { ReportStatus } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'
import { ReportResponseTypes, ResponseEvaluation } from '../../core/model'
import { useReportSearchQuery } from '../../core/queryhooks/reportQueryHooks'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ProResponseLabel } from '../../shared/ProResponseLabel'
import { ReportStatusLabel } from '../../shared/ReportStatus'
import { ScInput } from '../../shared/ScInput'
import { ScMenuItem } from '../../shared/ScMenuItem'
import { ScMultiSelect } from '../../shared/Select/MultiSelect'
import { ScSelect } from '../../shared/Select/Select'
import { SelectActivityCode } from '../../shared/SelectActivityCode'
import { SelectCountries } from '../../shared/SelectCountries/SelectCountries'
import { TrueFalseNull } from '../../shared/TrueFalseNull'
import { ConsumerReviewLabel } from '../../shared/reviews/ConsumerReviewLabel'

type AdvancedFiltersGridProps = {
  _reports: ReturnType<typeof useReportSearchQuery>
  onChangeStatus: (status: ReportStatus[]) => void
  onEmailChange: (email: string) => void
  onWebsiteURLChange: (websiteURL: string) => void
  onPhoneChange: (phone: string) => void
  onChangeHasProResponse: (b: boolean | null) => void
  _categories: Category[]
  proResponseFilter: ReportResponseTypes[]
  hasProResponse: boolean | null
  setProResponseFilter: React.Dispatch<
    React.SetStateAction<ReportResponseTypes[]>
  >
  onChangeProResponseFilter: (responses: ReportResponseTypes[]) => void
  connectedUser: {
    isDGCCRF: boolean
  }
  proResponseToStatus: {
    ACCEPTED: ReportStatus
    NOT_CONCERNED: ReportStatus
    REJECTED: ReportStatus
  }
  onSubcategoriesChange: (subcategories: string) => void
}
function invertIfDefined(bool: boolean | null) {
  return bool === null ? null : !bool
}

export const AdvancedReportsFilter: React.FC<AdvancedFiltersGridProps> = ({
  _reports,
  onChangeStatus,
  onEmailChange,
  onWebsiteURLChange,
  onPhoneChange,
  onChangeHasProResponse,
  _categories,
  connectedUser,
  hasProResponse,
  proResponseFilter,
  onChangeProResponseFilter,
  onSubcategoriesChange,
}) => {
  const { m } = useI18n()

  return (
    <Grid container spacing={1} sx={{ mt: 0 }}>
      <Grid item xs={12} md={6}>
        <SelectActivityCode
          label={m.codeNaf}
          value={_reports.filters.activityCodes ?? []}
          fullWidth
          onChange={(e, value) =>
            _reports.updateFilters((prev) => ({
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
          onChange={(e) =>
            _reports.updateFilters((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          <MenuItem value="">&nbsp;</MenuItem>
          {_categories?.map((category) => (
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
          onChange={onChangeStatus}
          fullWidth
          withSelectAll
          renderValue={(status) =>
            `(${status.length}) ${status
              .map((_) => m.reportStatusShort[_])
              .join(',')}`
          }
        >
          {Object.values(ReportStatus).map((status) => (
            <ScMenuItem withCheckbox key={status} value={status}>
              <ReportStatusLabel
                inSelectOptions
                dense
                fullWidth
                status={status}
              />
            </ScMenuItem>
          ))}
        </ScMultiSelect>
      </Grid>
      {connectedUser.isDGCCRF && (
        <Grid item xs={12} md={6}>
          <DebouncedInput
            value={_reports.filters.email ?? ''}
            onChange={onEmailChange}
          >
            {(value, onChange) => (
              <ScInput
                label={m.emailConsumer}
                fullWidth
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={m.website}
            value={_reports.filters.hasWebsite ?? null}
            onChange={(hasWebsite) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                hasWebsite: hasWebsite ?? undefined,
              }))
            }
            dropdownArrow
          />
          {_reports.filters.hasWebsite === true && (
            <DebouncedInput
              value={_reports.filters.websiteURL ?? ''}
              onChange={onWebsiteURLChange}
            >
              {(value, onChange) => (
                <ScInput
                  label={m.url}
                  fullWidth
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={m.phone}
            value={_reports.filters.hasPhone ?? null}
            onChange={(hasPhone) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                hasPhone: hasPhone ?? undefined,
              }))
            }
            dropdownArrow
          />
          {_reports.filters.hasPhone === true && (
            <DebouncedInput
              value={_reports.filters.phone ?? ''}
              onChange={onPhoneChange}
            >
              {(value, onChange) => (
                <ScInput
                  label={m.phone}
                  fullWidth
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={m.foreignCountry}
            value={_reports.filters.hasForeignCountry ?? null}
            onChange={(hasForeignCountry) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                hasForeignCountry: hasForeignCountry ?? undefined,
              }))
            }
            dropdownArrow
          />
          {_reports.filters.hasForeignCountry === true && (
            <SelectCountries
              label={m.foreignCountry}
              fullWidth
              value={_reports.filters.companyCountries}
              onChange={(companyCountries) =>
                _reports.updateFilters((prev) => ({
                  ...prev,
                  companyCountries,
                }))
              }
            />
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <TrueFalseNullRow
          label={m.consoAnonyme}
          value={invertIfDefined(_reports.filters.contactAgreement ?? null)}
          onChange={(contactAgreement) =>
            _reports.updateFilters((prev) => ({
              ...prev,
              contactAgreement: invertIfDefined(contactAgreement) ?? undefined,
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TrueFalseNullRow
          label={m.hasAttachement}
          value={_reports.filters.hasAttachment ?? null}
          onChange={(hasAttachment) =>
            _reports.updateFilters((prev) => ({
              ...prev,
              hasAttachment: hasAttachment ?? undefined,
            }))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={'Avis conso initial sur la réponse'}
            value={_reports.filters.hasResponseEvaluation ?? null}
            onChange={(hasResponseEvaluation) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                hasResponseEvaluation: hasResponseEvaluation ?? undefined,
              }))
            }
            dropdownArrow
          />
          {_reports.filters.hasResponseEvaluation === true && (
            <ScMultiSelect
              label="Avis"
              value={_reports.filters.responseEvaluation ?? []}
              onChange={(evaluation) =>
                _reports.updateFilters((prev) => ({
                  ...prev,
                  responseEvaluation: evaluation,
                }))
              }
              fullWidth
              withSelectAll
              renderValue={(evaluation) =>
                `(${evaluation.length}) ${evaluation
                  .map((_) => m.responseEvaluationShort[_])
                  .join(',')}`
              }
            >
              {Object.values(ResponseEvaluation).map((evaluation) => (
                <ScMenuItem withCheckbox key={evaluation} value={evaluation}>
                  <ConsumerReviewLabel evaluation={evaluation} displayLabel />
                </ScMenuItem>
              ))}
            </ScMultiSelect>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={'Avis conso ultérieur'}
            value={_reports.filters.hasEngagementEvaluation ?? null}
            onChange={(hasEngagementEvaluation) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                hasEngagementEvaluation: hasEngagementEvaluation ?? undefined,
              }))
            }
            dropdownArrow
          />
          {_reports.filters.hasEngagementEvaluation === true && (
            <ScMultiSelect
              label="Avis"
              value={_reports.filters.engagementEvaluation ?? []}
              onChange={(evaluation) =>
                _reports.updateFilters((prev) => ({
                  ...prev,
                  engagementEvaluation: evaluation,
                }))
              }
              fullWidth
              withSelectAll
              renderValue={(evaluation) =>
                `(${evaluation.length}) ${evaluation
                  .map((_) => m.responseEvaluationShort[_])
                  .join(',')}`
              }
            >
              {Object.values(ResponseEvaluation).map((evaluation) => (
                <ScMenuItem withCheckbox key={evaluation} value={evaluation}>
                  <ConsumerReviewLabel evaluation={evaluation} displayLabel />
                </ScMenuItem>
              ))}
            </ScMultiSelect>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={m.proResponse}
            value={hasProResponse}
            onChange={onChangeHasProResponse}
            dropdownArrow
          />
          {hasProResponse === true && (
            <ScMultiSelect
              label={m.proResponse}
              value={proResponseFilter}
              onChange={onChangeProResponseFilter}
              fullWidth
              withSelectAll
              renderValue={(proResponse) =>
                `(${proResponse.length}) ${proResponse
                  .map((_) => m.reportResponseShort[_])
                  .join(',')}`
              }
            >
              {Object.values(ReportResponseTypes).map((proResponse) => (
                <ScMenuItem withCheckbox key={proResponse} value={proResponse}>
                  <ProResponseLabel proResponse={proResponse} />
                </ScMenuItem>
              ))}
            </ScMultiSelect>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={m.foreignReport}
            value={_reports.filters.isForeign ?? null}
            onChange={(isForeign) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                isForeign: isForeign ?? undefined,
              }))
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box>
          <TrueFalseNullRow
            label={'Code-barres'}
            value={_reports.filters.hasBarcode ?? null}
            onChange={(hasBarcode) =>
              _reports.updateFilters((prev) => ({
                ...prev,
                hasBarcode: hasBarcode ?? undefined,
              }))
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <DebouncedInput
          value={_reports.filters?.subcategories?.join(',') ?? ''}
          onChange={onSubcategoriesChange}
        >
          {(value, onChange) => (
            <ScInput
              label="Sous catégories"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </DebouncedInput>
      </Grid>
    </Grid>
  )
}

export function TrueFalseNullRow({
  label,
  value,
  onChange,
  dropdownArrow = false,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean | null) => void
  dropdownArrow?: boolean
}) {
  const { m } = useI18n()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 1,
      }}
    >
      <Box sx={{ color: 'rgba(0, 0, 0, 0.6)', ml: 1 }}>{label}</Box>
      <TrueFalseNull
        label={
          dropdownArrow
            ? {
                true: (
                  <>
                    {m.yes}{' '}
                    <Icon fontSize="inherit" sx={{ mr: '-4px' }}>
                      arrow_drop_down
                    </Icon>
                  </>
                ),
              }
            : {}
        }
        sx={{ flexBasis: '50%' }}
        value={value}
        onChange={onChange}
      />
    </Box>
  )
}
