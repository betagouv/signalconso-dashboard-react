import {ButtonProps} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {useApiContext} from 'core/context/ApiContext'
import {useState} from 'react'
import {useConnectedContext} from '../../core/context/ConnectedContext'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScButton} from '../../shared/Button'
import {Datepicker} from '../../shared/Datepicker'
import {ScDialog} from '../../shared/ScDialog'

// TRELLO-2353
// On arrête de compter et d'afficher les retours courriers
// pour tester si la feature est vraiment utile
export const HIDE_UNDELIVERED_DOC_FEATURE = true

interface Props extends Omit<ButtonProps, 'onChange'> {
  siret: string
}

export const SaveUndeliveredDocBtn = ({siret, ...props}: Props) => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const {connectedUser} = useConnectedContext()
  const {toastSuccess} = useToast()
  const [returnDate, setReturnDate] = useState<Date | undefined>(new Date())
  const _saveUndeliveredDocument = useMutation({
    mutationFn: (params: {siret: string; returnedDate: Date}) =>
      api.secured.company.saveUndeliveredDocument(params.siret, params.returnedDate),
  })

  const loading = _saveUndeliveredDocument.isPending
  const onChange = async (date: Date | undefined) => {
    if (date) return _saveUndeliveredDocument.mutate({siret, returnedDate: date})
    else throw new Error("Can't save with an empty date")
  }
  if (!connectedUser.isAdmin) {
    return <></>
  }
  return (
    <ScDialog
      title={m.undeliveredDocTitle}
      loading={loading}
      confirmLabel={'Enregistrer'}
      confirmDisabled={!returnDate}
      onConfirm={(event, close) =>
        onChange(returnDate)
          .then(() => toastSuccess(m.changesSaved))
          .then(close)
      }
      content={
        <>
          <p className="mb-4">
            Quand un courrier d'activation destiné à cette entreprise nous a été retourné (mauvaise adresse, refus, etc.), vous
            pouvez l'indiquer ici.
          </p>
          <p className="mb-4">Cela permet de garder une trace de cet évènement.</p>

          <Datepicker
            sx={{mr: 1}}
            fullWidth
            label={m.returnDate}
            value={returnDate}
            onChange={setReturnDate}
            timeOfDay={'startOfDay'}
          />
        </>
      }
    >
      <ScButton variant="outlined" icon="cancel_schedule_send" color="primary" {...props}>
        {m.undeliveredDoc}
      </ScButton>
    </ScDialog>
  )
}
