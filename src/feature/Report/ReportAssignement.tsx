import {Icon, MenuItem} from '@mui/material'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useToast} from 'alexlibs/mui-extension'
import {useApiContext} from 'core/context/ApiContext'
import {useLogin} from 'core/context/LoginContext'
import {CompanyAccess, MinimalUser, ReportSearchResult, User} from 'core/model'
import {useCompanyAccessesQuery} from 'core/queryhooks/companyQueryHooks'
import {GetReportQueryKeys} from 'core/queryhooks/reportQueryHooks'
import {Link} from 'react-router-dom'
import {ScSelect} from 'shared/Select/Select'

type AssignMutationVariables = {reportId: string; newAssignedUserId: string}

function useAssignMutation() {
  const {api} = useApiContext()
  const {toastSuccess, toastError} = useToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({reportId, newAssignedUserId}: AssignMutationVariables) =>
      api.secured.reports.updateReportAssignedUser(reportId, newAssignedUserId),
    onSuccess: (assignedUser: User, {reportId}: AssignMutationVariables) => {
      queryClient.setQueryData(GetReportQueryKeys(reportId), (prev: ReportSearchResult): ReportSearchResult => {
        return {...prev, assignedUser: assignedUser}
      })
      toastSuccess('Le signalement a été réaffecté')
    },
    onError: () => {
      toastError('Une erreur est survenue')
    },
  })
}

export function ReportAssignement({
  reportSearchResult,
  companySiret,
}: {
  reportSearchResult: ReportSearchResult
  companySiret: string
}) {
  const {connectedUser} = useLogin()
  const _assign = useAssignMutation()
  const reportId = reportSearchResult.report.id
  const assignedUser = reportSearchResult.assignedUser
  const isAssignedToCurrentUser = assignedUser?.id === connectedUser.id
  const _accesses = useCompanyAccessesQuery(companySiret)
  const options = _accesses.data
    ? _accesses.data.map(buildOptionFromAccess)
    : [
        // when loading, at least display the currently assigned user
        ...(assignedUser ? [buildOptionFromUser(assignedUser)] : []),
      ]

  const selectedId = assignedUser?.id || ''
  return (
    <div className="flex flex-col items-start sm:items-end gap-1  min-w-[120px]">
      <ScSelect
        size="small"
        value={selectedId}
        variant="outlined"
        onChange={event => {
          _assign.mutate({reportId, newAssignedUserId: event.target.value})
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
      {!isAssignedToCurrentUser && (
        <Link
          to={''}
          className="block text-scbluefrance text-sm"
          onClick={() => {
            _assign.mutate({reportId, newAssignedUserId: connectedUser.id})
          }}
        >
          Me l'affecter
        </Link>
      )}
    </div>
  )
}

function buildOptionFromUser(user: MinimalUser) {
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
