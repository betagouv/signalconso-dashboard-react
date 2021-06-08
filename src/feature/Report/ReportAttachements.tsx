import {UploadedFile} from 'core/api'
import {Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {useLoginContext} from '../../App'
import {Config} from '../../conf/config'
import {some} from 'fp-ts/lib/Option'
import React from 'react'

export interface ReportAttachementsProps {
  attachements: UploadedFile[]
}

const useReportAttachementsStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: t.spacing(-1)
  }
}))
export const ReportAttachements = ({attachements}: ReportAttachementsProps) => {
  const css = useReportAttachementsStyles()
  return (
    <div className={css.root}>
      {attachements.map(_ => <ReportAttachement attachement={_}/>)}
    </div>
  )
}

export interface ReportAttachementProps {
  attachement: UploadedFile
  dense?: boolean
}

const allowedExtenions = ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx']

export enum AttachementType {
  Image = 'Image',
  PDF = 'PDF',
  Doc = 'Doc',
  Other = 'Other',
}

const extensionToType = (fileName: string): AttachementType | undefined => {
  const ext = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png': {
      return AttachementType.Image
    }
    case 'pdf': {
      return AttachementType.PDF
    }
    case 'doc':
    case 'docx': {
      return AttachementType.Doc
    }
    default: {
      return undefined
    }
  }
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'inline-flex',
    border: '1px solid ' + t.palette.divider,
    margin: t.spacing(1),
    borderRadius: 8,
    height: 90,
    width: 90,
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

export const ReportAttachement = ({attachement, dense}: ReportAttachementProps) => {
  const fileType = extensionToType(attachement.filename)
  const css = useStyles()
  const {apiSdk} = useLoginContext()
  const fileUrl = some(apiSdk.public.document.getLink(attachement)).map(_ => Config.isDev
    ? _.replace(Config.baseUrl, 'https://signal-api.conso.gouv.fr')
    : _
  ).toUndefined()

  return (
    <Tooltip title={attachement.filename}>
      <a target="_blank" href={fileUrl} className={css.root}>
        {(() => {
          switch (fileType) {
            case AttachementType.Image: {
              return <div style={{backgroundImage: `url(${fileUrl})`}}/>
            }
            case AttachementType.PDF: {
              return (
                <div>
                  <Icon className={css.imgPdf}>picture_as_pdf</Icon>
                </div>
              )
            }
            case AttachementType.Doc: {
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

const useReportAttachementSmallStyles = makeStyles((t: Theme) => ({
  imgPdf: {
    color: '#db4537',
  },
  imgDoc: {
    color: '#4185f3',
  },
  imgPicture: {
    color: '#00c385',
  }
}))

export const ReportAttachementSmall = ({attachement}: ReportAttachementProps) => {
  const fileType = extensionToType(attachement.filename)
  const css = useReportAttachementSmallStyles()
  const {apiSdk} = useLoginContext()
  const fileUrl = some(apiSdk.public.document.getLink(attachement)).map(_ => Config.isDev
    ? _.replace(Config.baseUrl, 'https://signal-api.conso.gouv.fr')
    : _
  ).toUndefined()

  return (
    <Tooltip title={attachement.filename} key={attachement.id}>
      <a href={fileUrl} target="_blank">
        {(() => {
          switch (fileType) {
            case AttachementType.Image: {
              return (
                <Icon className={css.imgPicture}>image</Icon>
              )
            }
            case AttachementType.PDF: {
              return (
                <Icon className={css.imgPdf}>picture_as_pdf</Icon>
              )
            }
            case AttachementType.Doc: {
              return (
                <Icon className={css.imgDoc}>article</Icon>
              )
            }
            default: {
              return (
                <Icon>insert_drive_file</Icon>
              )
            }
          }
        })()}
      </a>
    </Tooltip>
  )
}
