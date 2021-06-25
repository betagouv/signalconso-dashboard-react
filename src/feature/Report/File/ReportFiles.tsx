import {FileOrigin, Id, UploadedFile} from 'core/api'
import {Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {useLoginContext} from '../../../App'
import {Config} from '../../../conf/config'
import {some} from 'fp-ts/lib/Option'
import React from 'react'
import {extensionToType, FileType, reportFileConfig} from './reportFileConfig'
import {ReportFileAdd} from './ReportFileAdd'
import {useI18n} from '../../../core/i18n'
import {PanelTitle} from '../../../shared/Panel'

export interface ReportFilesProps {
  files?: UploadedFile[]
  onNewFile?: () => void
  reportId: Id
  fileOrigin: FileOrigin
  hideAddBtn?: boolean
}

const useReportFilesStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: t.spacing(-1)
  }
}))

export const ReportFiles = ({reportId, fileOrigin, files, hideAddBtn, onNewFile = () => void 0}: ReportFilesProps) => {
  const css = useReportFilesStyles()
  const {m} = useI18n()
  return (
    <>
      <PanelTitle>{m.attachedFiles}</PanelTitle>
      <div className={css.root}>
        {files?.filter(_ => _.origin === fileOrigin).map(_ => <ReportFile key={_.id} file={_}/>)}
        {!hideAddBtn && <ReportFileAdd reportId={reportId} fileOrigin={fileOrigin} onUploaded={onNewFile}/>}
      </div>
    </>
  )
}

export interface ReportFileProps {
  file: UploadedFile
  dense?: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'inline-flex',
    border: '1px solid ' + t.palette.divider,
    margin: t.spacing(1),
    borderRadius: reportFileConfig.cardBorderRadius,
    height: reportFileConfig.cardSize,
    width: reportFileConfig.cardSize,
    color: t.palette.text.hint,
    overflow: 'hidden',
    transition: t.transitions.create('all'),
    '&:hover': {
      boxShadow: t.shadows[4],
    },
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundSize: 'cover',
      height: '100%',
      width: '100%',
    }
  },
  imgPdf: {
    color: '#db4537',
  },
  imgDoc: {
    color: '#4185f3',
  },
}))

export const ReportFile = ({file, dense}: ReportFileProps) => {
  const fileType = extensionToType(file.filename)
  const css = useStyles()
  const {apiSdk} = useLoginContext()
  const fileUrl = some(apiSdk.public.document.getLink(file)).map(_ => Config.isDev
    ? _.replace(Config.apiBaseUrl, 'https://signal-api.conso.gouv.fr')
    : _
  ).toUndefined()

  return (
    <Tooltip title={file.filename}>
      <a target="_blank" href={fileUrl} className={css.root}>
        {(() => {
          switch (fileType) {
            case FileType.Image: {
              return <div style={{backgroundImage: `url(${fileUrl})`}}/>
            }
            case FileType.PDF: {
              return (
                <div>
                  <Icon className={css.imgPdf}>picture_as_pdf</Icon>
                </div>
              )
            }
            case FileType.Doc: {
              return (
                <div>
                  <Icon className={css.imgDoc}>article</Icon>
                </div>
              )
            }
            default: {
              return (
                <div>
                  <Icon>insert_drive_file</Icon>
                </div>
              )
            }
          }
        })()}
      </a>
    </Tooltip>
  )
}

