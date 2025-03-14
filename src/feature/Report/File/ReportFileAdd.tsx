import { Box, Button, CircularProgress, Icon, Tooltip } from '@mui/material'
import { useRef, useState } from 'react'
import { makeSx } from '../../../alexlibs/mui-extension'
import { config } from '../../../conf/config'
import {
  FileOrigin,
  UploadedFile,
} from '../../../core/client/file/UploadedFile'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { useToast } from '../../../core/context/toast/toastContext'
import { useI18n } from '../../../core/i18n'
import { Id } from '../../../core/model'
import { styleUtils } from '../../../core/theme'
import { reportFileConfig } from './reportFileConfig'

const css = makeSx({
  root: {
    border: (t) => '1px solid ' + t.palette.divider,
    my: 1,
    borderRadius: '0',
    height: reportFileConfig.cardSize,
    width: reportFileConfig.cardSize,
    color: (t) => t.palette.text.disabled,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: (t) => styleUtils(t).fontSize.small,
    textTransform: 'initial',
    fontWeight: 'normal',
    lineHeight: 1.4,
  },
})

interface Props {
  reportId: Id
  fileOrigin: FileOrigin
  onUploaded: (f: UploadedFile) => void
}

export const ReportFileAdd = ({ reportId, onUploaded, fileOrigin }: Props) => {
  const { m } = useI18n()
  const { api: apiSdk } = useConnectedContext()
  const { toastError } = useToast()

  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const fileInputEl = useRef<HTMLInputElement>(null)

  const openFileSelection = () => {
    fileInputEl.current!.click()
  }

  const handleChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file: File = files[0]
      if (file.size > config.upload_maxSizeMb * 1024 * 1024) {
        toastError({ message: m.invalidSize(config.upload_maxSizeMb) })
        setErrorMessage(m.invalidSize(config.upload_maxSizeMb))
        return
      }
      setUploading(true)
      apiSdk.public.attachements
        .upload(file, fileOrigin)
        .then(onUploaded)
        .catch(toastError)
        .finally(() => setUploading(false))
    }
  }

  if (uploading) {
    return (
      <Box sx={css.root}>
        <Box sx={css.body}>
          <CircularProgress />
        </Box>
      </Box>
    )
  } else {
    return (
      <Tooltip title={m.addAttachmentFile}>
        <Button sx={css.root} onClick={openFileSelection}>
          <Box sx={css.body}>
            <Icon sx={css.icon}>add</Icon>
          </Box>
          <input
            style={{ display: 'none' }}
            type="file"
            ref={fileInputEl}
            onChange={(e) => handleChange(e.target.files)}
          />
        </Button>
      </Tooltip>
    )
  }
}
