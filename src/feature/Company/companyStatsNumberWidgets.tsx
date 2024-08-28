import {Icon, LinearProgress, Tooltip} from '@mui/material'
import {useConnectedContext} from 'core/context/ConnectedContext'
import {useI18n} from 'core/i18n'
import {EventActionValues, Id} from 'core/model'
import {
  useCompanyAccessCountQuery,
  useGetResponseRateQuery,
  useIsAllowedToManageCompanyAccessesQuery,
} from 'core/queryhooks/companyQueryHooks'
import {useGetCompanyEventsQuery} from 'core/queryhooks/eventQueryHooks'
import {
  useGetCompanyRefundBlackMailQuery,
  useGetCompanyThreatQuery,
  useGetResponseDelayQuery,
} from 'core/queryhooks/statsQueryHooks'
import {siteMap} from 'core/siteMap'
import {PropsWithChildren} from 'react'
import {NavLink} from 'react-router-dom'

type Props = {
  companyId: Id
}

export function CompanyStatsNumberWidgets({id, siret}: {id: Id; siret: string}) {
  const {connectedUser} = useConnectedContext()
  const companyId = id
  return (
    <div className={`grid grid-cols-2 ${connectedUser.isNotPro ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4 mb-4`}>
      <NumberWidgetResponseRate {...{companyId}} />
      <NumberWidgetResponseDelay {...{companyId}} />
      <NumberWidgetAccesses {...{companyId, siret}} />
      {connectedUser.isNotPro && (
        <>
          <NumberWidgetDocsSent {...{siret}} />
          <NumberWidgetThreats {...{companyId}} />
          <NumberWidgetBlackmail {...{companyId}} />
        </>
      )}
    </div>
  )
}

function NumberWidgetResponseRate({companyId}: Props) {
  const _responseRate = useGetResponseRateQuery(companyId)
  return (
    <Widget>
      <p className="text-3xl font-bold">{_responseRate.data}%</p>
      <p>de signalements répondus</p>
    </Widget>
  )
}

function NumberWidgetResponseDelay({companyId}: Props) {
  const _responseDelay = useGetResponseDelayQuery(companyId)
  const {m} = useI18n()
  return (
    <Widget loading={_responseDelay.isLoading}>
      {!_responseDelay.isLoading &&
        (_responseDelay.data ? (
          <>
            <p className="text-3xl font-bold">
              {_responseDelay.data ? _responseDelay.data.toDays : '∞'} {m.days}
            </p>
            <p>en moyenne pour répondre</p>
          </>
        ) : (
          <p>{m.avgResponseTimeDescNoData}</p>
        ))}
    </Widget>
  )
}
function NumberWidgetThreats({companyId}: Props) {
  const _getCompanyThreat = useGetCompanyThreatQuery(companyId)
  const {m} = useI18n()
  return (
    <Widget loading={_getCompanyThreat.isLoading}>
      {_getCompanyThreat.data && (
        <>
          <p className="text-3xl font-bold">{_getCompanyThreat.data.value}</p>
          <p className="flex items-center gap-2">
            {m.proTheatToConsumer}{' '}
            <Tooltip title={m.proTheatToConsumerDesc}>
              <Icon sx={{color: t => t.palette.text.disabled}} fontSize="medium">
                help
              </Icon>
            </Tooltip>
          </p>
        </>
      )}
    </Widget>
  )
}
function NumberWidgetBlackmail({companyId}: Props) {
  const _getCompanyRefundBlackMail = useGetCompanyRefundBlackMailQuery(companyId)
  const {m} = useI18n()
  return (
    <Widget loading={_getCompanyRefundBlackMail.isLoading}>
      {_getCompanyRefundBlackMail.data && (
        <>
          <p className="text-3xl font-bold ">{_getCompanyRefundBlackMail.data.value}</p>
          <p className="flex items-center gap-2">
            {m.proRefundBlackMail}{' '}
            <Tooltip title={m.proRefundBlackMailDesc}>
              <Icon sx={{color: t => t.palette.text.disabled}} fontSize="medium">
                help
              </Icon>
            </Tooltip>
          </p>
        </>
      )}
    </Widget>
  )
}
function NumberWidgetDocsSent({siret}: {siret: string}) {
  const _companyEvents = useGetCompanyEventsQuery(siret)
  const count = _companyEvents.data?.filter(_ => _.data.action === EventActionValues.PostAccountActivationDoc).length
  const {m} = useI18n()
  return (
    <Widget loading={_companyEvents.isLoading}>
      {count !== undefined && (
        <>
          <p className="text-3xl font-bold">{count}</p>
          <p className="">courriers envoyés</p>
        </>
      )}
    </Widget>
  )
}
function NumberWidgetAccesses({siret, companyId}: {siret: string; companyId: string}) {
  const _accesses = useCompanyAccessCountQuery(siret)
  const displayAccessesLink = useIsAllowedToManageCompanyAccessesQuery(companyId) ?? false
  const {m} = useI18n()
  const link = (
    <>
      (<NavLink to={siteMap.logged.company(companyId).accesses.valueAbsolute}>voir</NavLink>)
    </>
  )
  return (
    <Widget loading={_accesses.isLoading}>
      {_accesses.data !== undefined && (
        <>
          <p className="text-3xl font-bold">{_accesses.data}</p>
          <p className="">
            {m.accountsActivated} {displayAccessesLink && link}
          </p>
        </>
      )}
    </Widget>
  )
}

function Widget({
  children,
  loading,
}: PropsWithChildren & {
  loading?: boolean
}) {
  return (
    <div className="p-4 flex flex-col border-solid border border-gray-300 rounded shadow-md">
      {loading ? (
        <div className="min-h-[100px]">
          <LinearProgress />
        </div>
      ) : (
        children
      )}
    </div>
  )
}
