import React, {useEffect, useState} from 'react'
import {Btn, IconBtn} from 'mui-extension/lib'
import {CircularProgress, Icon, LinearProgress, makeStyles, Menu, MenuItem, Theme, Tooltip} from '@material-ui/core'
import {useI18n} from '../../core/i18n'
import {AsyncFile, AsyncFileStatus, AsyncFileType} from '../../core/api/client/async-file/AsyncFile'
import {useAsyncFileContext} from '../../core/context/AsyncFileContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fnSwitch} from '../../core/helper/utils'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {useReportedPhonesContext} from '../../core/context/ReportedPhonesContext'
import {useInterval} from 'mui-extension/lib/core/utils/useInterval'
import {Fetch} from '@alexandreannic/react-hooks-lib/lib'
import {useReportsContext} from '../../core/context/ReportsContext'

interface Props {
  disabled?: boolean
  tooltipBtnNew?: string
  loading?: boolean
  fetch: Fetch<() => Promise<any>>
  files?: AsyncFile[]
  fileType: AsyncFileType
  onNewExport: () => Promise<any>
}

const useStyles = makeStyles((t: Theme) => ({
  btnContainer: {
    padding: t.spacing(0, 2, .5, 2),
  },
  btnNew: {
    width: '100%',
  },
  fileItemBody: {
    marginLeft: t.spacing(1),
    minWidth: 220,
  },
  fileItem: {
    borderBottom: '1px solid ' + t.palette.divider,
    display: 'flex',
    marginLeft: t.spacing(1),
  }
}))

export const ExportPopperBtn = ({
  tooltipBtnNew,
  loading,
  fetch,
  files,
  fileType,
  disabled,
  onNewExport,
}: Props) => {
  const {m, formatDateTime} = useI18n()
  const css = useStyles()
  const cssUtils = useUtilsCss()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useInterval(() => {
    if (anchorEl !== null) {
      fetch({clean: false})()
    }
  }, 2000)

  useEffect(() => {
    if (anchorEl !== null) {
      fetch({clean: true, force: true})().then(() => setInitialLoading(false))
    }
  }, [anchorEl])

  return (
    <>
      <Tooltip title={m.exportInXLS}>
        <IconBtn onClick={handleClick}>
          <Icon>file_download</Icon>
        </IconBtn>
      </Tooltip>
      <Menu
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        anchorEl={anchorEl}>
        {initialLoading && loading && <LinearProgress/>}
        <div className={css.btnContainer} onClick={() => onNewExport().then(fetch({clean: false}))}>
          <Tooltip title={tooltipBtnNew ?? ''}>
            <span>
              <Btn disabled={disabled} color="primary" variant="outlined" size="small" className={css.btnNew} icon="add">
                {m.exportInXLS}
              </Btn>
            </span>
          </Tooltip>
        </div>
        {files?.filter(_ => _.type === fileType).map(file =>
          <div key={file.id}>
            {fnSwitch(file.status, {
              [AsyncFileStatus.Successed]: _ => (
                <a href={file.url} target="_blank">
                  <MenuItem dense className={css.fileItem}>
                    <Icon className={cssUtils.colorTxtHint}>insert_drive_file</Icon>
                    <div className={css.fileItemBody}>
                      <Txt bold block>{file.filename.match(/.*?\-(\w+.?)\.xlsx/)?.[1]}</Txt>
                      <Txt color="hint">{formatDateTime(file.creationDate)}</Txt>
                    </div>
                  </MenuItem>
                </a>
              ),
              [AsyncFileStatus.Loading]: _ => (
                <MenuItem dense className={css.fileItem}>
                  <CircularProgress size={24}/>
                  <div className={css.fileItemBody}>
                    <Txt skeleton/>
                    <Txt color="hint">{formatDateTime(file.creationDate)}</Txt>
                  </div>
                </MenuItem>
              ),
              [AsyncFileStatus.Failed]: _ => (
                <MenuItem dense className={css.fileItem}>
                  <Icon className={cssUtils.colorError}>error</Icon>
                  <div className={css.fileItemBody}>
                    <div>{m.error}</div>
                    <Txt color="hint">{formatDateTime(file.creationDate)}</Txt>
                  </div>
                </MenuItem>
              ),
            })}
          </div>
        )}
      </Menu>
    </>
  )
}

export const ExportPhonesPopper = () => {
  const _asyncFile = useAsyncFileContext()
  const _reportPhone = useReportedPhonesContext()
  return <ExportPopperBtn
    loading={_asyncFile.loading}
    fileType={AsyncFileType.ReportedPhones}
    onNewExport={_reportPhone.extract}
    fetch={_asyncFile.fetch}
    files={_asyncFile.entity}
  />
}

export const ExportReportsPopper = (props: {disabled?: boolean, tooltipBtnNew?: string}) => {
  const _asyncFile = useAsyncFileContext()
  const _reports = useReportsContext()
  return <ExportPopperBtn
    {...props}
    loading={_asyncFile.loading}
    fileType={AsyncFileType.Reports}
    onNewExport={_reports.extract}
    fetch={_asyncFile.fetch}
    files={_asyncFile.entity}
  />
}
