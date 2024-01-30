import {useI18n} from '../../core/i18n'
import {useSetState} from '../../alexlibs/react-hooks-lib'
import {useLogin} from '../../core/context/LoginContext'
import {Id} from '../../core/model'
import {ScButton} from '../../shared/Button'
import {DatatableToolbar} from '../../shared/Datatable/DatatableToolbar'
import {useMutation} from '@tanstack/react-query'

const DatatableHeaderToolBar= () => {

    const {m} = useI18n()
    const {apiSdk} = useLogin()
  
    const downloadReports = useMutation({mutationFn: apiSdk.secured.reports.download})
  
    const selectReport = useSetState<Id>()



  return (
    <DatatableToolbar
    open={selectReport.size > 0}
    onClear={selectReport.clear}
    actions={
      <ScButton
        loading={downloadReports.isPending}
        variant="contained"
        icon="file_download"
        onClick={() => {
          downloadReports.mutate(selectReport.toArray())
        }}
        sx={{
          marginLeft: 'auto',
        }}
      >
        {m.download}
      </ScButton>
    }
  >
    <span dangerouslySetInnerHTML={{__html: m.nSelected(selectReport.size)}} />
  </DatatableToolbar>
  );
}

export default DatatableHeaderToolBar;