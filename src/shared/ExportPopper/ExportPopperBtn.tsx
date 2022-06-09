import React, {ReactElement, ReactNode, useEffect, useState} from 'react'
import {Btn} from 'mui-extension/lib'
import {Box, CircularProgress, Icon, Menu, MenuItem, Tooltip} from '@mui/material'
import {useI18n} from '../../core/i18n'
import {AsyncFile, AsyncFileKind, AsyncFileStatus} from '@signal-conso/signalconso-api-sdk-js'
import {useAsyncFileContext} from '../../core/context/AsyncFileContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {fnSwitch} from '../../core/helper/utils'
import {useReportedPhonesContext} from '../../core/context/ReportedPhonesContext'
import {useInterval} from 'mui-extension/lib/core/utils/useInterval'
import {Fetch} from '@alexandreannic/react-hooks-lib/lib'
import {useReportsContext} from '../../core/context/ReportsContext'
import {useUnregistredWebsiteWithCompanyContext} from '../../core/context/UnregistredWebsitesContext'

interface Props {
  className?: string
  disabled?: boolean
  tooltipBtnNew?: string
  loading?: boolean
  fetch: Fetch<() => Promise<any>>
  files?: AsyncFile[]
  fileType: AsyncFileKind
  onNewExport: () => Promise<any>
  children: ReactElement<any>
  onClick?: (event: any) => void
}

export const FileItem = ({icon, children, onClick}: {onClick?: () => void; icon: ReactNode; children: ReactNode}) => {
  return (
    <Box sx={{display: 'flex'}} onClick={onClick}>
      {icon}
      <Box sx={{ml: 1, minWidth: 200}}>{children}</Box>
    </Box>
  )
}

export const ExportPopperBtn = ({
  children,
  tooltipBtnNew,
  loading,
  onClick,
  className,
  fetch,
  files,
  fileType,
  disabled,
  onNewExport,
}: Props) => {
  const {m, formatDateTime} = useI18n()
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
      fetch({clean: false})
    }
  }, 2000)

  useEffect(() => {
    if (anchorEl !== null) {
      fetch({clean: true, force: true}).then(() => setInitialLoading(false))
    }
  }, [anchorEl])

  return (
    <>
      <Tooltip title={m.exportInXLS}>
        <span>
          {React.cloneElement(children, {
            onClick: (event: any) => {
              if (onClick) onClick(event)
              handleClick(event)
            },
            className,
          })}
        </span>
      </Tooltip>
      <Menu keepMounted open={!!anchorEl} onClose={handleClose} anchorEl={anchorEl}>
        <Box sx={{pt: 0, pr: 2, pb: 0.5, pl: 2}}>
          <Tooltip title={tooltipBtnNew ?? ''}>
            <span>
              <Btn
                disabled={disabled}
                color="primary"
                variant="outlined"
                size="small"
                sx={{width: '100%'}}
                icon="add"
                onClick={() => onNewExport().then(() => fetch({clean: false}))}
              >
                {m.exportInXLS}
              </Btn>
            </span>
          </Tooltip>
        </Box>
        {initialLoading && loading && (
          <Box
            sx={{
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {files?.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              m: 1,
              color: t => t.palette.text.disabled,
            }}
          >
            {m.noExport}
          </Box>
        )}
        {files
          ?.filter(_ => _.kind === fileType)
          .map(file => (
            <MenuItem
              sx={{
                '&:not(:last-of-type)': {
                  borderBottom: t => '1px solid ' + t.palette.divider,
                },
              }}
              dense
              key={file.id}
            >
              {fnSwitch(file.status, {
                [AsyncFileStatus.Successed]: _ => (
                  <FileItem
                    onClick={() => window.open(file.url, '_blank')}
                    icon={<Icon sx={{color: t => t.palette.success.light}}>file_download_done</Icon>}
                  >
                    <Txt bold block>
                      {file.filename.match(/.*?-(\w+.?\.xlsx)/)?.[1]}
                    </Txt>
                    <Txt color="hint">{formatDateTime(file.creationDate)}</Txt>
                  </FileItem>
                ),
                [AsyncFileStatus.Loading]: _ => (
                  <FileItem icon={<CircularProgress size={24} />}>
                    <Txt skeleton="100%" block />
                    <Txt color="hint">{formatDateTime(file.creationDate)}</Txt>
                  </FileItem>
                ),
                [AsyncFileStatus.Failed]: _ => (
                  <FileItem icon={<Icon sx={{color: t => t.palette.error.main}}>error_outline</Icon>}>
                    <div>{m.error}</div>
                    <Txt color="hint">{formatDateTime(file.creationDate)}</Txt>
                  </FileItem>
                ),
              })}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}

interface ExportReportProps {
  className?: string
  children: ReactElement<any>
  disabled?: boolean
  onClick?: (event: any) => void
  tooltipBtnNew?: string
}

export const ExportPhonesPopper = (props: ExportReportProps) => {
  const _asyncFile = useAsyncFileContext()
  const _reportPhone = useReportedPhonesContext()
  return (
    <ExportPopperBtn
      {...props}
      loading={_asyncFile.loading}
      fileType={AsyncFileKind.ReportedPhones}
      onNewExport={_reportPhone.extract.fetch}
      fetch={_asyncFile.fetch}
      files={_asyncFile.entity}
    />
  )
}

export const ExportReportsPopper = (props: ExportReportProps) => {
  const _asyncFile = useAsyncFileContext()
  const _reports = useReportsContext()
  return (
    <ExportPopperBtn
      {...props}
      loading={_asyncFile.loading}
      fileType={AsyncFileKind.Reports}
      onNewExport={_reports.extract}
      fetch={_asyncFile.fetch}
      files={_asyncFile.entity}
    />
  )
}

export const ExportUnknownWebsitesPopper = (props: ExportReportProps) => {
  const _asyncFile = useAsyncFileContext()
  const _extract = useUnregistredWebsiteWithCompanyContext()
  return (
    <ExportPopperBtn
      {...props}
      loading={_asyncFile.loading}
      fileType={AsyncFileKind.ReportedWebsites}
      onNewExport={_extract.extractUnregistered.fetch}
      fetch={_asyncFile.fetch}
      files={_asyncFile.entity}
    />
  )
}
