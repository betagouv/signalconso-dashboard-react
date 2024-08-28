import { CompanyWithReportsCount } from 'core/model'
import { useGetCompanyEventsQuery } from 'core/queryhooks/eventQueryHooks'
import { ReportEvents } from 'feature/Report/Event/ReportEvents'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'

export function CompanyHistory({
  company,
}: {
  company: CompanyWithReportsCount | undefined
}) {
  return company ? <CompanyHistoryLoaded {...{ company }} /> : null
}

function CompanyHistoryLoaded({
  company,
}: {
  company: CompanyWithReportsCount
}) {
  const _companyEvents = useGetCompanyEventsQuery(company.siret)
  return (
    <CleanDiscreetPanel loading={_companyEvents.isLoading}>
      {/* <h2 className="font-bold text-xl mb-4">Historique de l'entreprise</h2> */}
      <ReportEvents events={_companyEvents.data} />
    </CleanDiscreetPanel>
  )
}
