import {useI18n} from '../../../core/i18n'

import React from 'react'
import {Button, Icon} from '@mui/material'
import {useFetcher} from '../../../alexlibs/react-hooks-lib'
import {useLogin} from '../../../core/context/LoginContext'
import {FileOrigin} from '../../../core/client/file/UploadedFile'
import {useReportContext} from '../../../core/context/ReportContext'
import {Link} from 'react-router-dom'
import {Txt} from 'alexlibs/mui-extension/Txt'

export function ReportFileDeleteButton({reportId, fileOrigin}: {reportId: string; fileOrigin?: FileOrigin}) {
  const {m} = useI18n()
  const {apiSdk} = useLogin()
  const reportContext = useReportContext()

  const download = async () => {
    await reportContext.downloadAll.fetch({}, reportId, fileOrigin)
  }

  return (
    <Link to={'_blank'} className="flex mt-1 ml-1" onClick={_ => download()}>
      <Txt bold block size="small" gutterBottom>
        ({m.downloadAll})
      </Txt>
    </Link>
  )
}
