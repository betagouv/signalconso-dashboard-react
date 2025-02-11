import { Icon, MenuItem } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReactElement, useState } from 'react'
import { ReportSearchResult } from '../../core/client/report/Report'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toastContext'
import { useI18n } from '../../core/i18n'
import { CompanyAccess, MinimalUser, User } from '../../core/model'
import { useCompanyAccessesQuery } from '../../core/queryhooks/companyQueryHooks'
import { GetReportQueryKeys } from '../../core/queryhooks/reportQueryHooks'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'
import { ScSelect } from '../../shared/Select/Select'

interface Props {
  reportSearchResult: ReportSearchResult
  companySiret: string
  children: ReactElement<any>
}

export function buildOptionFromUser(user: MinimalUser) {
  return {
    id: user.id,
    fullName: User.buildFullName(user),
  }
}

export const ReportAffectation = ({
  reportSearchResult,
  companySiret,
  children,
}: Props) => {
  const { m } = useI18n()
  const report = reportSearchResult.report
  const reportId = report.id
  const assignedUser = reportSearchResult.assignedUser
  const [comment, setComment] = useState('')
  const [user, setUser] = useState(assignedUser?.id)
  const _accesses = useCompanyAccessesQuery(companySiret)
  type AssignMutationVariables = { reportId: string; newAssignedUserId: string }

  const options = _accesses.data
    ? _accesses.data.map(buildOptionFromAccess)
    : [
        // when loading, at least display the currently assigned user
        ...(assignedUser ? [buildOptionFromUser(assignedUser)] : []),
      ]

  function buildOptionFromAccess(access: CompanyAccess) {
    return {
      id: access.userId,
      fullName: User.buildFullName(access),
    }
  }

  function useAssignMutation() {
    const { api } = useApiContext()
    const { toastSuccess, toastError } = useToast()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ reportId, newAssignedUserId }: AssignMutationVariables) =>
        api.secured.reports.updateReportAssignedUser(
          reportId,
          newAssignedUserId,
          comment,
        ),
      onSuccess: (
        assignedUser: User,
        { reportId }: AssignMutationVariables,
      ) => {
        queryClient.setQueryData(
          GetReportQueryKeys(reportId),
          (prev: ReportSearchResult): ReportSearchResult => {
            return { ...prev, assignedUser: assignedUser }
          },
        )
        setComment('')
        toastSuccess('Le signalement a été réaffecté')
      },
      onError: () => {
        toastError({ message: 'Une erreur est survenue' })
      },
    })
  }

  const _assign = useAssignMutation()

  return (
    <ScDialog
      title={'Affectation du signalement'}
      loading={_assign.isPending}
      onConfirm={(event, close) => {
        if (user) {
          _assign.mutate({ reportId, newAssignedUserId: user })
        }
        return close()
      }}
      confirmLabel={m.validate}
      confirmDisabled={user === undefined || user === assignedUser?.id}
      content={
        <>
          <p className={'mb-4 mt-3'}>
            Vous avez la possibilité d'affecter ce signalement à vous même ou a
            un autre utilisateur de votre entreprise, ce dernier recevra un
            email l'informant de cette affectation.
          </p>

          <div className="flex flex-col items-start sm:items-end gap-1 min-w-[120px]">
            <ScSelect
              size="medium"
              value={user}
              variant="outlined"
              onChange={(event) => {
                setUser(event.target.value)
              }}
              label={'Affecté à'}
              fullWidth
            >
              {options.map((option) => {
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
          </div>
          <b className={'mt-10 mb-15'}>Commentaire :</b>
          <ScInput
            value={comment}
            placeholder={
              "Entrez votre commentaire ici, il sera transmis par email et visible depuis l''historique du signalement."
            }
            onChange={(e) => setComment(e.target.value)}
            multiline
            fullWidth
            rows={10}
            maxRows={50}
          />
        </>
      }
    >
      {children}
    </ScDialog>
  )
}
