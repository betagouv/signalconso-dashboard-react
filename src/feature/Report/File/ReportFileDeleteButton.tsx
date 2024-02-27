import {Button, Icon} from '@mui/material'
import {Modal} from '../../../alexlibs/mui-extension'
import {useI18n} from '../../../core/i18n'

export function ReportFileDeleteButton({filename, onConfirm}: {filename: string; onConfirm: () => void}) {
  const {m} = useI18n()
  return (
    <Button size={'small'} className="flex m-0">
      <Icon fontSize="inherit" className="mr-1">
        delete
      </Icon>
      <Modal
        maxWidth="md"
        cancelLabel={m.cancel}
        confirmLabel={m.confirm}
        onConfirm={onConfirm}
        content={_ => <p className="mb-0" dangerouslySetInnerHTML={{__html: m.thisWillBeRemoved(filename)}} />}
      >
        <span>{m.delete.toLowerCase()}</span>
      </Modal>
    </Button>
  )
}
