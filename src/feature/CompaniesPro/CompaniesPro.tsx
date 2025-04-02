import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Collapse,
  FormControlLabel,
  Icon,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import { Modal } from 'alexlibs/mui-extension'
import {
  CompanyWithAccessAndCounts,
  flattenProCompaniesExtended,
} from 'core/client/company/Company'
import { useGetAccessibleByProExtendedQuery } from 'core/queryhooks/companyQueryHooks'
import {
  BlockedNotificationsQuery,
  useAddBlockedNotification,
  useBlockedNotificationsQuery,
  useRemoveBlockedNotification,
} from 'core/queryhooks/reportBlockedNotificationQueryHooks'

import { ReportSearchLink } from 'feature/Report/quickSmallLinks'
import { AddressComponent } from 'shared/Address'
import { DsfrAlertSmall } from 'shared/DsfrAlert'
import { Page } from 'shared/Page'
import { PageTitle } from 'shared/Page/PageTitle'
import { ScSwitch } from 'shared/ScSwitch'
export function CompaniesPro() {
  const _companiesAccessibleByPro = useGetAccessibleByProExtendedQuery()
  const data = _companiesAccessibleByPro.data
  const _blockedNotifications = useBlockedNotificationsQuery()

  const allCompaniesIds =
    (data && flattenProCompaniesExtended(data).map((_) => _.company.id)) ?? []
  const allBlockedIds = allCompaniesIds.filter((id) =>
    _blockedNotifications.data?.some((_) => _.companyId == id),
  )
  const hasBlockedSome = allBlockedIds.length > 0
  const totalNbCompanies = allCompaniesIds.length
  return (
    <Page>
      <PageTitle
        action={
          <ManageNotificationsButton {...{ allCompaniesIds, allBlockedIds }} />
        }
      >
        Mes entreprises
      </PageTitle>
      <Collapse in={hasBlockedSome} timeout={300}>
        <div className="mb-8 mt-4 w-fit">
          <DsfrAlertSmall>
            <p>
              Vous avez{' '}
              <b>
                désactivé l'envoi d'email de notifications des nouveaux
                signalements
              </b>{' '}
              pour au moins une de vos entreprises .
              <br />
              Vous devrez vous connecter régulièrement sur votre espace pour
              consulter les nouveaux signalements.
            </p>
          </DsfrAlertSmall>
        </div>
      </Collapse>
      <p className="mb-2 text-sm">
        Le nombre de signalements de chaque entreprise n'est pas en temps réel.
        Il est rafraîchi toutes les heures.
      </p>
      {data && (
        <div className="flex flex-col gap-8 mb-10 lg:mb-20">
          {data.headOfficesAndSubsidiaries.map(
            ({ headOffice, subsidiaries }) => {
              return (
                <TopLevelRow
                  key={headOffice.company.id}
                  company={headOffice}
                  secondLevel={subsidiaries}
                  {...{ _blockedNotifications, totalNbCompanies }}
                />
              )
            },
          )}
          {data.loneSubsidiaries.map((company) => {
            return (
              <TopLevelRow
                key={company.company.id}
                {...{ company }}
                {...{ _blockedNotifications, totalNbCompanies }}
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
  _blockedNotifications,
  totalNbCompanies,
}: {
  company: CompanyWithAccessAndCounts
  secondLevel?: CompanyWithAccessAndCounts[]
  _blockedNotifications: BlockedNotificationsQuery
  totalNbCompanies: number
}) {
  return (
    <div className="">
      <RowContent
        {...{ company }}
        isTopLevel={true}
        {...{ _blockedNotifications }}
      />
      {secondLevel ? (
        <div className="ml-10">
          <Accordion
            defaultExpanded={
              secondLevel.length > 0 &&
              (secondLevel.length <= 2 || totalNbCompanies < 6)
            }
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
                      {...{ _blockedNotifications }}
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
  _blockedNotifications,
}: {
  company: CompanyWithAccessAndCounts
  _blockedNotifications: BlockedNotificationsQuery
}) {
  return (
    <RowContent {...{ company, _blockedNotifications }} isTopLevel={false} />
  )
}

function RowContent({
  company: _company,
  isTopLevel,
  _blockedNotifications,
}: {
  company: CompanyWithAccessAndCounts
  isTopLevel: boolean
  _blockedNotifications: BlockedNotificationsQuery
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
    _blockedNotifications.data?.some((_) => _.companyId === companyId) ?? false
  const _block = useAddBlockedNotification([companyId])
  const _unblock = useRemoveBlockedNotification([companyId])
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
                disabled={
                  _blockedNotifications.isPending ||
                  _block.isPending ||
                  _unblock.isPending
                }
                onChange={() => {
                  if (isBlocked) {
                    _unblock.mutate()
                  } else {
                    _block.mutate()
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

export function ManageNotificationsButton({
  allCompaniesIds,
  allBlockedIds,
}: {
  allCompaniesIds: string[]
  allBlockedIds: string[]
}) {
  const _block = useAddBlockedNotification(allCompaniesIds)
  const _unblock = useRemoveBlockedNotification(allCompaniesIds)
  const allBlocked = allBlockedIds.length === allCompaniesIds.length
  const allUnblocked = allBlockedIds.length === 0
  return (
    <Modal
      title="Gérer les notifications"
      maxWidth="sm"
      content={() => (
        <div className="space-y-4">
          <p>
            Les boutons ci-dessous vous permettent d'activer ou de désactiver
            l'envoi d'email de notifications des nouveaux signalements pour{' '}
            <b>l'ensemble de vos entreprises.</b>
          </p>
          <div className="flex flex-col gap-2 items-stretch">
            <Button
              startIcon={<Icon>block</Icon>}
              variant="outlined"
              onClick={() => {
                _block.mutate()
              }}
              disabled={allBlocked}
            >
              Je ne veux plus aucune notification
            </Button>
            <Button
              variant="outlined"
              startIcon={<Icon>mail</Icon>}
              onClick={() => {
                _unblock.mutate()
              }}
              disabled={allUnblocked}
            >
              Je veux recevoir toutes les notifications
            </Button>
          </div>
          <p>
            Pour un réglage plus fin, fermez cette fenêtre et utiliser le bouton
            "<i>Être notifié par email</i>" entreprise par entreprise.
          </p>
        </div>
      )}
      loading={_block.isPending || _unblock.isPending}
      cancelLabel="Fermer"
    >
      <Button variant="outlined">Gérer les notifications</Button>
    </Modal>
  )
}
