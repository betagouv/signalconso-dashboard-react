import {Icon, MenuItem} from '@mui/material'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useToast} from 'alexlibs/mui-extension'
import {useApiContext} from 'core/context/ApiContext'
import {CompanyAccess, ReportSearchResult, User} from 'core/model'
import {useCompanyAccessesQuery} from 'core/queryhooks/companyQueryHooks'
import {GetReportQueryKeys} from 'core/queryhooks/reportQueryHooks'
import {Link} from 'react-router-dom'
import {ScSelect} from 'shared/Select/Select'

type MutationVariables = {reportId: string; newAssignedUserId: string}

export function ReportAssignement({
  reportSearchResult,
  companySiret,
}: {
  reportSearchResult: ReportSearchResult
  companySiret: string
}) {
  const {api} = useApiContext()
  const {toastSuccess, toastError} = useToast()
  const queryClient = useQueryClient()
  const _update = useMutation({
    mutationFn: (mutationVariables: MutationVariables) =>
      api.secured.reports.updateReportAssignedUser(mutationVariables.reportId, mutationVariables.newAssignedUserId),
    onSuccess: (assignedUser, mutationVariables) => {
      queryClient.setQueryData(GetReportQueryKeys(mutationVariables.reportId), (prev: ReportSearchResult): ReportSearchResult => {
        const newOne = {...prev, assignedUser: assignedUser}
        return newOne
      })
      toastSuccess('Le signalement a été réaffecté')
    },
    onError: () => {
      toastError('Une erreur est survenue')
    },
  })
  const reportId = reportSearchResult.report.id
  const assignedUser = reportSearchResult.assignedUser
  const _accesses = useCompanyAccessesQuery(companySiret)
  const options = _accesses.data
    ? _accesses.data.map(buildOptionFromAccess)
    : [
        // when loading, at least display the currently assigned user
        ...(assignedUser ? [buildOptionFromUser(assignedUser)] : []),
      ]

  const selectedId = assignedUser?.id || ''
  return (
    <div className="flex flex-col items-start sm:items-end gap-1">
      <ScSelect
        size="small"
        value={selectedId}
        variant="outlined"
        onChange={event => {
          const userId = event.target.value
          _update.mutate({reportId, newAssignedUserId: userId})
        }}
        label={'Affecté à'}
        fullWidth
      >
        {options.map(option => {
          return (
            <MenuItem value={option.id} key={option.id}>
              <div className="flex items-center gap-1">
                <Icon className="">account_circle</Icon>
                {option.fullName}
              </div>
            </MenuItem>
          )
        })}
      </ScSelect>

      <Link to={''} className="block text-scbluefrance text-sm">
        Me l'affecter
      </Link>
    </div>
  )
}

function buildOptionFromUser(user: User) {
  return {
    id: user.id,
    fullName: User.buildFullName(user),
  }
}

function buildOptionFromAccess(access: CompanyAccess) {
  return {
    id: access.userId,
    fullName: User.buildFullName(access),
  }
}
