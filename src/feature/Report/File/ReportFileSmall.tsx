import {some} from 'fp-ts/lib/Option'
import {Config} from '../../../conf/config'
import {Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import React from 'react'
import {extensionToType, FileType} from './reportFileConfig'
import {ReportFileProps} from './ReportFile'
import {useLogin} from '../../../core/context/LoginContext'

const useReportFileSmallStyles = makeStyles((t: Theme) => ({
  imgPdf: {
    color: '#db4537',
  },
  imgDoc: {
    color: '#4185f3',
  },
  imgPicture: {
    color: '#00c385',
  },
}))

export const ReportFileSmall = ({file}: ReportFileProps) => {
  const fileType = extensionToType(file.filename)
  const css = useReportFileSmallStyles()
  const {apiSdk} = useLogin()
  const fileUrl = some(apiSdk.public.document.getLink(file))
    .map(_ => (Config.isDev ? _.replace(Config.apiBaseUrl, 'https://signal-api.conso.gouv.fr') : _))
    .toUndefined()

  return (
    <Tooltip title={file.filename} key={file.id}>
      <a href={fileUrl} target="_blank">
        {(() => {
          switch (fileType) {
            case FileType.Image: {
              return <Icon className={css.imgPicture}>image</Icon>
            }
            case FileType.PDF: {
              return <Icon className={css.imgPdf}>picture_as_pdf</Icon>
            }
            case FileType.Doc: {
              return <Icon className={css.imgDoc}>article</Icon>
            }
            default: {
              return <Icon>insert_drive_file</Icon>
            }
          }
        })()}
      </a>
    </Tooltip>
  )
}
