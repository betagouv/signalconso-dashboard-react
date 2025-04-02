import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Icon,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import { Alert } from 'alexlibs/mui-extension'
import {
  CompanyWithAccessAndCounts,
  flattenProCompaniesExtended,
} from 'core/client/company/Company'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import {
  NotificationsQueries,
  useBlockedNotificationsQueries,
} from 'core/queryhooks/reportBlockedNotificationQueryHooks'
import { ReportSearchLink } from 'feature/Report/quickSmallLinks'
import { AddressComponent } from 'shared/Address'
import { Page } from 'shared/Page'
import { PageTitle } from 'shared/Page/PageTitle'
import { ScSwitch } from 'shared/ScSwitch'

export function CompaniesPro() {
  const _companiesAccessibleByPro = useGetAccessibleByProExtendedQuery()
  const data = _companiesAccessibleByPro.data
  const notificationsQueries = useBlockedNotificationsQueries()

  const allCompaniesIds =
    data && flattenProCompaniesExtended(data).map((_) => _.company.id)
  const hasBlockedSome =
    allCompaniesIds?.some((id) =>
      notificationsQueries._blockedNotifList.data?.some(
        (_) => _.companyId == id,
      ),
    ) ?? false
  return (
    <Page>
      <PageTitle>Mes entreprises</PageTitle>
      {hasBlockedSome && (
        <div className="mb-4">
          <Alert type="info">
            Vous avez désactivé l'envoi d'email de notifications des nouveaux
            signalements pour au moins une de vos entreprises.
            <br />
            Vous devrez vous connecter régulièrement sur votre espace pour
            consulter les nouveaux signalements.
          </Alert>
        </div>
      )}
      {data && (
        <div className="flex flex-col gap-8 mb-10 lg:mb-20">
          {data.headOfficesAndSubsidiaries.map(
            ({ headOffice, subsidiaries }) => {
              return (
                <TopLevelRow
                  key={headOffice.company.id}
                  company={headOffice}
                  secondLevel={subsidiaries}
                  {...{ notificationsQueries }}
                />
              )
            },
          )}
          {data.loneSubsidiaries.map((company) => {
            return (
              <TopLevelRow
                key={company.company.id}
                {...{ company }}
                {...{ notificationsQueries }}
              />
            )
          })}
        </div>
      )}
    </Page>
  )
}

function TopLevelRow({
  company,
  secondLevel,
  notificationsQueries,
}: {
  company: CompanyWithAccessAndCounts
  secondLevel?: CompanyWithAccessAndCounts[]
  notificationsQueries: NotificationsQueries
}) {
  return (
    <div className="">
      <RowContent
        {...{ company }}
        isTopLevel={true}
        {...{ notificationsQueries }}
      />
      {secondLevel ? (
        <div className="ml-10">
          <Accordion
            defaultExpanded={secondLevel.length > 0 && secondLevel.length <= 2}
            elevation={0}
            disabled={secondLevel.length === 0}
            className="border border-solid border-gray-400 border-t-0 !rounded-t-none"
          >
            <AccordionSummary
              expandIcon={<Icon className=" mr-1">expand_more</Icon>}
              className="!bg-gray-200 font-bold  !flex-row-reverse !flex-gap-20   "
            >
              {secondLevel.length} établissements secondaires
            </AccordionSummary>
            <AccordionDetails>
              <div className="divide-y divide-gray-300">
                {secondLevel.map((c) => {
                  return (
                    <SecondLevelRow
                      key={c.company.id}
                      {...{ company: c }}
                      {...{ notificationsQueries }}
                    />
                  )
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ) : null}
    </div>
  )
}

function SecondLevelRow({
  company,
  notificationsQueries,
}: {
  company: CompanyWithAccessAndCounts
  notificationsQueries: NotificationsQueries
}) {
  return (
    <RowContent {...{ company, notificationsQueries }} isTopLevel={false} />
  )
}

function RowContent({
  company: _company,
  isTopLevel,
  notificationsQueries,
}: {
  company: CompanyWithAccessAndCounts
  isTopLevel: boolean
  notificationsQueries: NotificationsQueries
}) {
  const {
    company,
    access,
    reportsCount,
    directAccessesCount,
    ongoingReportsCount,
  } = _company
  const companyId = company.id
  const reportSearch = {
    companyIds: [company.id],
  }
  const isBlocked =
    notificationsQueries._blockedNotifList.data?.some(
      (_) => _.companyId === companyId,
    ) ?? false
  const ongoingReportsLabel = `${ongoingReportsCount} à traiter`
  return (
    <div
      className={`space-y-1 ${isTopLevel ? 'bg-white border-gray-400 border px-8 py-6' : 'bg-white p-2'}`}
    >
      <div className="flex gap-4 lg:flex-row flex-col">
        <div className="lg:contents flex gap-4">
          <div className="flex flex-col items-start justify-start">
            <p>
              <Link
                to="/entreprise/$companyId/bilan"
                params={{ companyId }}
                className={`text-scbluefrance ${isTopLevel ? 'font-bold' : ''}`}
              >
                {company.name}
              </Link>
            </p>
            <p>{company.siret}</p>
          </div>
          <div>
            <AddressComponent address={company.address} />
          </div>
        </div>
        <div className="flex gap-4 lg:gap-0 lg:flex-col lg:items-end items-start grow min-w-52">
          <span>
            {`${reportsCount} signalement${reportsCount > 1 ? 's' : ''}`}
            {reportsCount > 0 ? (
              <span>
                {' '}
                (
                {ongoingReportsCount > 0 ? (
                  <ReportSearchLink
                    reportSearch={reportSearch}
                    label={ongoingReportsLabel}
                  />
                ) : (
                  <span>{ongoingReportsLabel}</span>
                )}
                )
              </span>
            ) : null}
          </span>
          <FormControlLabel
            control={
              <ScSwitch
                size={isTopLevel ? 'medium' : 'small'}
                checked={!isBlocked}
                disabled={notificationsQueries.isPending}
                onChange={() => {
                  if (isBlocked) {
                    notificationsQueries._removeBlockedNotif.mutate([companyId])
                  } else {
                    notificationsQueries._addBlockedNotif.mutate([companyId])
                  }
                }}
              />
            }
            labelPlacement="end"
            className="!m-0 !flex !gap-1 !text-right lg:flex-row-reverse"
            label={
              <span>
                {isTopLevel ? 'Être notifié par email' : 'Notifié par email'}
              </span>
            }
          />
        </div>
      </div>

      {directAccessesCount !== undefined && (
        <>
          <div className="flex flex-col items-start justify-start">
            <span>
              <Icon fontSize="medium" className="text-black -mb-1.5 mr-1">
                people
              </Icon>
              <Link
                className={`text-scbluefrance`}
                to="/entreprise/$companyId/accesses"
                params={{ companyId }}
              >
                {directAccessesCount} utilisateurs
              </Link>
            </span>
          </div>
        </>
      )}
      {company.isHeadOffice && (
        <p className="">
          <span className="rounded-md mr-1  text-green-800">
            <Icon fontSize="small" className="mb-[-3px] mr-1">
              business
            </Icon>
            <b className="">Siège social</b>
            <span className="">
              {' '}
              : Les utilisateurs de cet établissement ont accès à tous ses
              établissements secondaires
            </span>
          </span>
        </p>
      )}
    </div>
  )
}
