import {
  Box,
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import {
  EventCategories,
  ExportsActions,
  trackEvent,
} from 'core/plugins/Matomo'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Alert, Btn, Txt } from '../alexlibs/mui-extension'
import { useInterval } from '../alexlibs/react-hooks-lib'
import { fnSwitch } from '../alexlibs/ts-utils'
import {
  AsyncFile,
  AsyncFileKind,
  AsyncFileStatus,
} from '../core/client/async-file/AsyncFile'
import { ReportSearch } from '../core/client/report/ReportSearch'
import { ReportedPhoneSearch } from '../core/client/reported-phone/ReportedPhone'
import { HostReportCountSearch } from '../core/client/website/Website'
import { useApiContext } from '../core/context/ApiContext'
import { useI18n } from '../core/i18n'
import { PaginatedFilters } from '../core/model'

interface Props {
  className?: string
  disabled?: boolean
  tooltipBtnNew?: string
  loading?: boolean
  fetch: () => Promise<any>
  files?: AsyncFile[]
  fileType: AsyncFileKind
  onNewExport: () => Promise<any>
  children: ReactElement<any>
  onClick?: (event: any) => void
  trackingEventAction: ExportsActions
}

const FileItem = ({
  icon,
  children,
  onClick,
}: {
  onClick?: () => void
  icon: ReactNode
  children: ReactNode
}) => {
  return (
    <Box sx={{ display: 'flex' }} onClick={onClick}>
      {icon}
      <Box sx={{ ml: 1, minWidth: 200 }}>{children}</Box>
    </Box>
  )
}

const ExportPopperBtn = ({
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
  trackingEventAction,
}: Props) => {
  const { m, formatDateTime } = useI18n()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const { connectedUser: user } = useConnectedContext()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useInterval(() => {
    if (anchorEl !== null) {
      fetch()
    }
  }, 2000)

  useEffect(() => {
    if (anchorEl !== null) {
      fetch().then(() => setInitialLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorEl])

  const ExportLabel = ({ file }: { file: AsyncFile }) => {
    return (
      <Txt bold block>
        Export de {m.AsyncFileDesc[file.kind]} du{' '}
        {formatDateTime(file.creationDate)}
      </Txt>
    )
  }

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
      <Menu
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        <div className={'mt-2 mr-2 mb-4 ml-2 w-[500px]'}>
          <p className={'ml-3 mb-2'}>
            Vous pouvez exporter les signalements de la liste ci-dessous dans un
            tableur Excel en cliquant sur "GÉNÉRER UN NOUVEL EXPORT"
          </p>
          <Alert id="action-info" dense type="info" className={'mt-2'}>
            <p>
              L'export est limité à 30 000 entrées. Pour importer plus
              d'éléments, réduisez le nombre de signalements en utilisant les
              filtres.
            </p>
          </Alert>
        </div>
        <Box sx={{ pt: 0, pr: 2, pb: 2, pl: 2 }}>
          <Tooltip title={tooltipBtnNew ?? ''}>
            <span>
              <Btn
                disabled={disabled}
                color="primary"
                variant="contained"
                sx={{ width: '100%' }}
                icon="post_add"
                onClick={() => {
                  trackEvent(user, EventCategories.Exports, trackingEventAction)
                  onNewExport().then(fetch)
                }}
              >
                <span className={'mt-1'}>{m.newExportInXLS}</span>
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
              color: (t) => t.palette.text.disabled,
            }}
          >
            {m.noExport}
          </Box>
        )}
        {files
          ?.filter((_) => _.kind === fileType)
          .map((file) => (
            <MenuItem
              sx={{
                '&:not(:last-of-type)': {
                  borderBottom: (t) => '1px solid ' + t.palette.divider,
                },
              }}
              dense
              key={file.id}
            >
              {fnSwitch(file.status, {
                [AsyncFileStatus.Successed]: (_) => (
                  <FileItem
                    onClick={() => window.open(file.url, '_blank')}
                    icon={
                      <Icon sx={{ color: (t) => t.palette.success.light }}>
                        file_download_done
                      </Icon>
                    }
                  >
                    <ExportLabel file={file} />
                    <Txt color="hint">Cliquez pour télécharger</Txt>
                  </FileItem>
                ),
                [AsyncFileStatus.Loading]: (_) => (
                  <FileItem icon={<CircularProgress size={20} />}>
                    <ExportLabel file={file} />
                    <Txt color="hint">Chargement, veuillez patienter...</Txt>
                  </FileItem>
                ),
                [AsyncFileStatus.Failed]: (_) => (
                  <FileItem
                    icon={
                      <Icon sx={{ color: (t) => t.palette.error.main }}>
                        error_outline
                      </Icon>
                    }
                  >
                    <ExportLabel file={file} />
                    <Txt color="hint">
                      Erreur lors de l'export, veuillez générer un nouvel
                      export.
                    </Txt>
                  </FileItem>
                ),
              })}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}

interface ExportReportProps<S> {
  className?: string
  children: ReactElement<any>
  disabled?: boolean
  onClick?: (event: any) => void
  tooltipBtnNew?: string
  filters: S
}

export const ExportPhonesPopper = (
  props: ExportReportProps<ReportedPhoneSearch>,
) => {
  const { api } = useApiContext()
  const _asyncFile = useQuery({
    queryKey: ['asyncFiles_fetch'],
    queryFn: api.secured.asyncFiles.fetch,
    enabled: false,
  })
  const _extract = useMutation({
    mutationFn: () => api.secured.reportedPhone.extract(props.filters),
  })
  return (
    <ExportPopperBtn
      {...props}
      loading={_asyncFile.isPending}
      fileType={AsyncFileKind.ReportedPhones}
      onNewExport={_extract.mutateAsync}
      fetch={() => _asyncFile.refetch()}
      files={_asyncFile.data}
      trackingEventAction={ExportsActions.exportPhonesExcel}
    />
  )
}

export const ExportReportsPopper = (
  props: ExportReportProps<ReportSearch & PaginatedFilters>,
) => {
  const { api } = useApiContext()
  const _asyncFile = useQuery({
    queryKey: ['asyncFiles_fetch'],
    queryFn: api.secured.asyncFiles.fetch,
    enabled: false,
  })
  const _extract = useMutation({
    mutationFn: () => api.secured.reports.extract(props.filters),
  })
  return (
    <ExportPopperBtn
      {...props}
      loading={_asyncFile.isPending}
      fileType={AsyncFileKind.Reports}
      onNewExport={_extract.mutateAsync}
      fetch={() => _asyncFile.refetch()}
      files={_asyncFile.data}
      trackingEventAction={ExportsActions.exportReportsExcel}
    />
  )
}

export const ExportUnknownWebsitesPopper = (
  props: ExportReportProps<HostReportCountSearch>,
) => {
  const { api } = useApiContext()
  const _asyncFile = useQuery({
    queryKey: ['asyncFiles_fetch'],
    queryFn: api.secured.asyncFiles.fetch,
    enabled: false,
  })
  const _extract = useMutation({
    mutationFn: () => api.secured.website.extractUnregistered(props.filters),
  })
  return (
    <ExportPopperBtn
      {...props}
      loading={_asyncFile.isPending}
      fileType={AsyncFileKind.ReportedWebsites}
      onNewExport={_extract.mutateAsync}
      fetch={() => _asyncFile.refetch()}
      files={_asyncFile.data}
      trackingEventAction={ExportsActions.exportUnknownWebsitesExcel}
    />
  )
}
