import { Button } from '@mui/material'
import { useConnectedContext } from 'core/context/connected/connectedContext'
import {
  AnalyticActionName,
  EventCategories,
  NewsletterActions,
  trackEvent,
} from 'core/plugins/Matomo'
import { Page, PageTitle } from 'shared/Page'

export const JoinNewsletter = () => {
  const { connectedUser } = useConnectedContext()
  const handleSubscribeClick = () => {
    trackEvent(
      connectedUser,
      EventCategories.Newsletter,
      NewsletterActions.reportsClik,
      AnalyticActionName.boutonAbonnezVous,
    )
  }
  return (
    <Page>
      <PageTitle>
        Restez informé de l’actualité de la consommation et de la concurrence.
      </PageTitle>
      <p>
        La newsletter mensuelle "Concurrence et consommation" de la DGCCRF est
        riche en informations clés. C'est une source essentielle pour ceux qui
        s'intéressent à la consommation, à la sécurité et à la concurrence.
      </p>
      <br />
      <p>
        Chaque édition offre des articles inédits et des analyses d'actualité, y
        compris les derniers résultats d'enquêtes, des interviews d'experts,
        ainsi que des conseils pratiques.
      </p>
      <br />
      <p>
        Abonnez-vous gratuitement pour rester informé des nouveautés
        législatives et réglementaires et pour obtenir des informations
        exclusives sur les événements organisés par la DGCCRF.
      </p>
      <br />
      <p>
        Cette newsletter a été conçue pour un public varié, allant des
        professionnels de la consommation et de la concurrence aux juristes, en
        passant par les chefs d'entreprise, ingénieurs qualité, journalistes,
        élus, étudiants et consommateurs, intéressés par les domaines d'action
        de la DGCCRF.
      </p>
      <br />
      <Button
        color="primary"
        variant="contained"
        target="_blank"
        href="https://lettres-infos.bercy.gouv.fr/DGCCRF/inscription"
        onClick={handleSubscribeClick}
      >
        ABONNEZ-VOUS
      </Button>
    </Page>
  )
}
