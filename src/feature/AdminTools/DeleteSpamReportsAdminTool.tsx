import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Alert } from '../../alexlibs/mui-extension'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { ScButton } from '../../shared/Button'
import { ScInput } from '../../shared/ScInput'

export const DeleteSpamReportsAdminTool = () => {
  const { apiSdk: api } = useConnectedContext()

  const { toastSuccess, toastError } = useToast()

  const _deleteReports = useMutation({
    mutationFn: (ids: string[]) => {
      return api.secured.admin.deleteReports(ids)
    },
  })
  const [reports, setReports] = useState<string>('')
  const [reportCount, setReportCount] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const updateStateBasedOnValidation = (
    validUUIDs: string[],
    invalidUUIDs: string[],
  ) => {
    if (invalidUUIDs.length === 0) {
      setReportCount(validUUIDs.length)
      setErrorMessage('')
    } else {
      setReportCount(0)
      setErrorMessage(
        `Les IDs de signalements suivants sont invalides: ${invalidUUIDs.join(
          ', ',
        )}`,
      )
    }
  }

  const handleClick = async () => {
    const { validUUIDs, invalidUUIDs } = parseAndValidateReports(reports)
    updateStateBasedOnValidation(validUUIDs, invalidUUIDs)
    if (invalidUUIDs.length === 0) {
      try {
        const res = await _deleteReports.mutateAsync(validUUIDs)
        toastSuccess(`Nombre de signalements traités : ${res.length}`)
      } catch (error) {
        // @ts-ignore
        toastError(error)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setReports(value)
    const { validUUIDs, invalidUUIDs } = parseAndValidateReports(value)
    if (value !== '') {
      updateStateBasedOnValidation(validUUIDs, invalidUUIDs)
    } else setErrorMessage('')
  }

  const parseAndValidateReports = (uuidString: string) => {
    const uuidArray = uuidString.split(',').map((id) => id.trim())
    const uuidv4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const validUUIDs: string[] = []
    const invalidUUIDs: string[] = []

    uuidArray.forEach((uuid) => {
      if (uuidv4Regex.test(uuid)) {
        validUUIDs.push(uuid)
      } else {
        invalidUUIDs.push(uuid)
      }
    })

    return { validUUIDs, invalidUUIDs }
  }

  return (
    <CleanWidePanel>
      <h2 className="font-bold text-lg mb-2">
        Supression des spams de signalements
      </h2>
      <div>
        Cet outil permet de supprimer les signalements considérés comme spam.
        Les IDs de signalements doivent provenir de la même entreprise ou
        filiale.
        <Alert type="warning" className={'my-4'}>
          <b>Les signalements seront supprimés de manière permanente</b>, donc
          merci de bien vérifier leur nature avant suppression. La suppression
          de signalements générera un événement incluant l’identité de
          l’entreprise concernée et l’auteur de l’action.
        </Alert>
        <div className="flex flex-col gap-2">
          <ScInput
            fullWidth
            multiline={true}
            type="text"
            label={'Ids des signalements (séparés par une virgule)'}
            value={reports}
            onChange={handleChange}
            error={
              reports !== '' &&
              parseAndValidateReports(reports).invalidUUIDs.length > 0
            }
          />
          {reportCount > 0 && (
            <span>{reportCount} identifiant(s) de signalements trouvé(s)</span>
          )}
          {errorMessage && <span className="text-red-600">{errorMessage}</span>}
          <ScButton
            onClick={handleClick}
            color="primary"
            disabled={_deleteReports.isPending}
            loading={_deleteReports.isPending}
          >
            Supprimer
          </ScButton>
        </div>
      </div>
    </CleanWidePanel>
  )
}
