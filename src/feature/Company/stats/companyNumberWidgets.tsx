import TimeIcon from '@mui/icons-material/AccessTime'
import ChatIcon from '@mui/icons-material/ChatBubbleOutline'
import UsersIcon from '@mui/icons-material/PeopleAlt'
import { Icon, LinearProgress, Tooltip } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import { useI18n } from 'core/i18n'
import { EventActionValues, Id } from 'core/model'
import {
  useCompanyAccessCountQuery,
  useGetResponseRateQuery,
  useIsAllowedToManageCompanyAccessesQuery,
} from 'core/queryhooks/companyQueryHooks'
import { useGetCompanyEventsQuery } from 'core/queryhooks/eventQueryHooks'
import {
  useGetCompanyRefundBlackMailQuery,
  useGetCompanyThreatQuery,
  useGetResponseDelayQuery,
} from 'core/queryhooks/statsQueryHooks'
import { PropsWithChildren } from 'react'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
type Props = {
  companyId: Id
}

export function CompanyCoreNumbers({ id, siret }: { id: Id; siret: string }) {
  const companyId = id
  return (
    <CleanInvisiblePanel>
      <NumberWidgetResponseRate {...{ companyId }} />
      <NumberWidgetResponseDelay {...{ companyId }} />
      <NumberWidgetAccesses {...{ companyId, siret }} />
    </CleanInvisiblePanel>
  )
}

export function CompanyConfidentialNumbers({
  id,
  siret,
}: {
  id: Id
  siret: string
}) {
  const { connectedUser } = useConnectedContext()
  const companyId = id
  if (connectedUser.isNotPro) {
    return (
      <CleanInvisiblePanel>
        <NumberWidgetDocsSent {...{ siret }} />
        <NumberWidgetThreats {...{ companyId }} />
        <NumberWidgetBlackmail {...{ companyId }} />
      </CleanInvisiblePanel>
    )
  }
  return null
}

function NumberWidgetResponseRate({ companyId }: Props) {
  const _responseRate = useGetResponseRateQuery(companyId)
  return (
    <Widget>
      <div className="flex items-center gap-2">
        <ChatIcon fontSize="small" />
        <p>
          <span className="text-lg font-bold">{_responseRate.data}%</span>
          <span className="text-base"> de signalements répondus</span>
        </p>
      </div>
    </Widget>
  )
}

function NumberWidgetResponseDelay({ companyId }: Props) {
  const _responseDelay = useGetResponseDelayQuery(companyId)
  const { m } = useI18n()
  return (
    <Widget loading={_responseDelay.isLoading}>
      {!_responseDelay.isLoading && (
        <div className="flex gap-2 items-center">
          <TimeIcon fontSize="small" />
          {_responseDelay.data ? (
            <p>
              <span className="text-lg font-bold">
                {_responseDelay.data ? _responseDelay.data.toDays : '∞'}{' '}
                {m.days}
              </span>{' '}
              en moyenne pour répondre
            </p>
          ) : (
            <p>{m.avgResponseTimeDescNoData}</p>
          )}
        </div>
      )}
    </Widget>
  )
}
function NumberWidgetThreats({ companyId }: Props) {
  const _getCompanyThreat = useGetCompanyThreatQuery(companyId)
  const { m } = useI18n()
  return (
    <Widget loading={_getCompanyThreat.isLoading}>
      {_getCompanyThreat.data && (
        <p>
          <span className="text-lg font-bold">
            {_getCompanyThreat.data.value}
          </span>{' '}
          {m.proTheatToConsumer}{' '}
          <span>
            <Tooltip title={m.proTheatToConsumerDesc}>
              <Icon fontSize="small" className="mb-[-3px] text-gray-500">
                help_outline
              </Icon>
            </Tooltip>
          </span>
        </p>
      )}
    </Widget>
  )
}
function NumberWidgetBlackmail({ companyId }: Props) {
  const _getCompanyRefundBlackMail =
    useGetCompanyRefundBlackMailQuery(companyId)
  const { m } = useI18n()
  return (
    <Widget loading={_getCompanyRefundBlackMail.isLoading}>
      {_getCompanyRefundBlackMail.data && (
        <p>
          <span className="text-lg font-bold ">
            {_getCompanyRefundBlackMail.data.value}
          </span>{' '}
          {m.proRefundBlackMail}{' '}
          <Tooltip title={m.proRefundBlackMailDesc}>
            <Icon fontSize="small" className="mb-[-3px] text-gray-500">
              help_outline
            </Icon>
          </Tooltip>
        </p>
      )}
    </Widget>
  )
}
function NumberWidgetDocsSent({ siret }: { siret: string }) {
  const _companyEvents = useGetCompanyEventsQuery(siret)
  const count = _companyEvents.data?.filter(
    (_) => _.event.action === EventActionValues.PostAccountActivationDoc,
  ).length
  return (
    <Widget loading={_companyEvents.isLoading}>
      {count !== undefined && (
        <p>
          <span className="text-lg font-bold">{count}</span>{' '}
          <span className="">courriers envoyés</span>
        </p>
      )}
    </Widget>
  )
}
function NumberWidgetAccesses({
  siret,
  companyId,
}: {
  siret: string
  companyId: string
}) {
  const _accesses = useCompanyAccessCountQuery(siret)
  const displayAccessesLink =
    useIsAllowedToManageCompanyAccessesQuery(companyId) ?? false
  const { m } = useI18n()

  const linkContent = (
    <>
      <span className="text-lg font-bold">{_accesses.data}</span>{' '}
      {m.accountsActivated}
    </>
  )
  return (
    <Widget loading={_accesses.isLoading}>
      {_accesses.data !== undefined && (
        <div className="flex gap-2 items-center">
          <UsersIcon fontSize="small" />
          <p>
            {displayAccessesLink ? (
              <Link to="/entreprise/$companyId/accesses" params={{ companyId }}>
                {linkContent}
              </Link>
            ) : (
              linkContent
            )}
          </p>
        </div>
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
    <div className="">
      {loading ? (
        <div className="min-h-[30px]">
          <LinearProgress />
        </div>
      ) : (
        children
      )}
    </div>
  )
}
