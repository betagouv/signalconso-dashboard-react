import React, {useRef, useState} from 'react'
import {Button, CircularProgress, Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {reportFileConfig} from './reportFileConfig'
import {useI18n} from '../../../core/i18n'
import {styleUtils} from '../../../core/theme'
import {Config} from '../../../conf/config'
import {FileOrigin, Id, UploadedFile} from '../../../core/api'
import {useToast} from '../../../core/toast'
import {useLogin} from '../../../core/context/LoginContext'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    border: '1px solid ' + t.palette.divider,
    margin: t.spacing(1),
    borderRadius: reportFileConfig.cardBorderRadius,
    height: reportFileConfig.cardSize,
    width: reportFileConfig.cardSize,
    color: t.palette.text.hint,
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
    fontSize: styleUtils(t).fontSize.small,
    textTransform: 'initial',
    fontWeight: 'normal',
    lineHeight: 1.4,
  }
}))

interface Props {
  reportId: Id
  fileOrigin: FileOrigin
  onUploaded: (f: UploadedFile) => void
}

export const ReportFileAdd = ({reportId, onUploaded, fileOrigin}: Props) => {
  const css = useStyles()
  const {m} = useI18n()
  const {apiSdk} = useLogin()
  const {toastError} = useToast()

  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const fileInputEl = useRef<HTMLInputElement>(null)

  const openFileSelection = () => {
    fileInputEl.current!.click()
  }

  const handleChange = (files: FileList | null) => {
    if (files) {
      const file = files[0]
      if (file.size > Config.uploadFileMaxSizeMb * 1024 * 1024) {
        toastError({message: m.invalidSize(Config.uploadFileMaxSizeMb)})
        setErrorMessage(m.invalidSize(Config.uploadFileMaxSizeMb))
        return
      }
      setUploading(true)
      apiSdk.public.document.upload(file, fileOrigin)
        .then(onUploaded)
        .catch(toastError)
        .finally(() => setUploading(false))
    }
  }

  if (uploading) {
    return (
      <div className={css.root}>
        <div className={css.body}>
          <CircularProgress/>
        </div>
      </div>
    )
  } else {
    return (
      <Tooltip title={m.addAttachmentFile}>
        <Button className={css.root} onClick={openFileSelection}>
          <div className={css.body}>
            <Icon className={css.icon}>add</Icon>
          </div>
          <input style={{display: 'none'}} type="file" ref={fileInputEl}
                 onChange={e => handleChange(e.target.files)}/>
        </Button>
      </Tooltip>
    )
  }
}

