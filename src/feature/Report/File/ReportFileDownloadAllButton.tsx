import {useI18n} from '../../../core/i18n'

import React from 'react'
import {FileOrigin} from '../../../core/client/file/UploadedFile'
import {Link} from 'react-router-dom'
import {Txt} from 'alexlibs/mui-extension/Txt'
import {Report} from '../../../core/client/report/Report'
import {useMutation} from '@tanstack/react-query'
import {useApiContext} from '../../../core/context/ApiContext'

export function ReportFileDeleteButton({report, fileOrigin}: {report: Report; fileOrigin?: FileOrigin}) {
  const {m} = useI18n()
  const {api} = useApiContext()

  const downloadReport = useMutation({
    mutationFn: (params: {report: Report; fileOrigin?: FileOrigin}) =>
      api.secured.reports.downloadAll(params.report, params.fileOrigin),
  })

  const download = (event: any) => {
    event.preventDefault() // Prevent default link behavior
    downloadReport.mutate({report, fileOrigin})
  }

  return (
    <Link to={'_blank'} className="flex mt-1 ml-1" onClick={download}>
      <Txt bold block size="small" gutterBottom>
        ({m.downloadAll})
      </Txt>
    </Link>
  )
}
