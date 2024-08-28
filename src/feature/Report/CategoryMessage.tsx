import React from 'react'
import { Report, ReportTag } from '../../core/client/report/Report'
import { Alert } from 'alexlibs/mui-extension'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface CategoryDetail {
  tag: ReportTag[]
  message: string
  baseLinkText: string
  link: string
}

const categoryMessages: CategoryDetail[] = [
  {
    tag: [ReportTag.ProduitPerime],
    message:
      'Ce signalement concerne un produit périmé. Pour connaître la réglementation applicable aux DLC et DDM, rendez-vous sur la ',
    baseLinkText:
      'fiche pratique de la DGCCRF "Date limite de consommation DLC et DDM"',
    link: 'https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/Date-limite-de-consommation-DLC-et-DDM',
  },
  {
    tag: [ReportTag.CommandeEffectuee],
    message:
      'Ce signalement concerne une commande réalisée sur internet. Pour connaître la réglementation applicable au e-commerce, rendez-vous sur la ',
    baseLinkText:
      'fiche pratique de la DGCCRF "E-commerce règles applicables au commerce électronique"',
    link: 'https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/E-commerce-regles-applicables-au-commerce-electronique',
  },
  {
    tag: [ReportTag.ImpressionTicket],
    message:
      'Ce signalement concerne l’impression des tickets de caisse sans demande préalable. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ',
    baseLinkText:
      'fiche pratique de la DGCCRF "Impression des tickets de caisse et autres à la demande des clients"',
    link: 'https://www.economie.gouv.fr/dgccrf/impression-des-tickets-de-caisse-et-autres-la-demande-des-clients',
  },
  {
    tag: [ReportTag.Shrinkflation],
    message:
      'À compter du 1er juillet 2024, l’information des consommateurs sur la réduflation, ou l’augmentation des prix des produits dont la quantité a diminué, devient obligatoire. Pour en savoir plus, rendez-vous sur ',
    baseLinkText: 'economie.gouv.fr',
    link: 'https://www.economie.gouv.fr/dgccrf/faq-sur-la-mise-en-oeuvre-de-larrete-du-16-avril-2024-relatif-linformation-des-consommateurs',
  },
  {
    tag: [ReportTag.AppelCommercial],
    message:
      'Ce signalement concerne un démarchage téléphonique abusif. Pour connaître la réglementation applicable au démarchage abusif, rendez-vous sur la ',
    baseLinkText:
      'fiche pratique de la DGCCRF "Renforcement des mesures pour lutter contre le démarchage abusif"',
    link: 'https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/renforcement-des-mesures-pour-lutter-contre-le-demarchage-abusif',
  },
  {
    tag: [ReportTag.Prix],
    message:
      'Ce signalement concerne l’affichage des prix. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ',
    baseLinkText: 'fiche pratique de la DGCCRF "Information sur les prix"',
    link: 'https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/L-information-sur-les-prix',
  },
  {
    tag: [ReportTag.AlimentationMaterielAnimaux],
    message:
      'Ce signalement concerne l’alimentation animale. Pour connaître la réglementation applicable à ce sujet, rendez-vous sur la ',
    baseLinkText:
      'fiche pratique de la DGCCRF "Alimentation animale professionnels"',
    link: 'https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/alimentation-animale-professionnels',
  },
]

const CategoryMessage: React.FC<{ report: Report }> = ({ report }) => {
  const detail = categoryMessages.find((cm) =>
    report.tags.some((tag) => cm.tag.includes(tag)),
  )

  if (!detail) {
    console.log('No matching detail found for any tag.')
    return null
  }

  return (
    <Alert type="info">
      <p>
        {detail.message}
        <a href={detail.link} target="_blank" rel="noopener noreferrer">
          {detail.baseLinkText}
          <OpenInNewIcon style={{ fontSize: '1rem' }} />
        </a>
        .
      </p>
    </Alert>
  )
}

export default CategoryMessage
