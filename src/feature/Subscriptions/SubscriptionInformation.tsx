import {Subscription} from '../../core/client/subscription/Subscription'
import {Category} from '../../core/client/constant/Category'
import {Alert} from '@mui/material'
import React from 'react'
import {OutdatedTags} from '../../core/client/report/Report'

interface SubscriptionInformationProps {
  subscription: Subscription
  outdatedCategories?: Category[]
}

export const SubscriptionInformation = ({outdatedCategories, subscription}: SubscriptionInformationProps) => {
  const allInactiveCategories =
    subscription.categories.length > 0 && subscription.categories.every(category => outdatedCategories?.includes(category))
  const someInactiveCategories = subscription.categories.filter(category => outdatedCategories?.includes(category))
  const allInactiveTags = subscription.withTags.length > 0 && subscription.withTags.every(tag => OutdatedTags.includes(tag))
  const someInactiveTags = subscription.withTags.filter(tag => OutdatedTags.includes(tag))
  const countryAndDepartementAtTheSameTime = subscription.countries.length > 0 && subscription.departments.length > 0

  const frequency = subscription.frequency === 'P1D' ? 'quotidiennement' : 'hebdomadairement'
  const category =
    subscription.categories.length === 0
      ? ''
      : subscription.categories.length === 1
      ? ` appartenant à la <b>catégorie ${subscription.categories[0]}</b>`
      : ` appartenant à <b>l'une des ${subscription.categories.length} catégories</b> sélectionnées`
  const country =
    subscription.countries.length === 0
      ? ''
      : subscription.countries.length === 1
      ? ` ayant eu lieu en <b>${subscription.countries[0].name}</b>`
      : ` ayant eu lieu dans <b>l'un des ${subscription.countries.length} pays</b> sélectionnés`
  const departement =
    subscription.departments.length === 0
      ? ''
      : subscription.departments.length === 1
      ? ` ayant eu lieu dans le département <b>${subscription.departments[0].label}</b>`
      : ` ayant eu lieu dans <b>l'un des ${subscription.departments.length} départements</b> sélectionnés`
  const siret =
    subscription.sirets.length === 0
      ? ''
      : subscription.sirets.length === 1
      ? ` concernant l'entreprise <b>${subscription.sirets[0]}</b>`
      : ` concernant <b>l'une des ${subscription.sirets.length} entreprises</b> sélectionnées`
  const withTags =
    subscription.withTags.length === 0
      ? ''
      : subscription.withTags.length === 1
      ? ` avec le tag <b>${subscription.withTags[0]}</b>`
      : ` avec <b>l'ensemble des ${subscription.withTags.length} tags</b> sélectionnés`
  const withoutTags =
    subscription.withoutTags.length === 0
      ? ''
      : subscription.withoutTags.length === 1
      ? ` n'ayant <b>pas</b> le tag <b>${subscription.withoutTags[0]}</b>`
      : ` n'ayant <b>aucun des ${subscription.withoutTags.length} tags</b> sélectionnés`

  const all = [category, country, departement, siret, withTags, withoutTags].filter(_ => _.length > 0).join(', ')

  if (allInactiveCategories) {
    return (
      <Alert severity="error" sx={{ml: 4, mr: 4}}>
        Cet abonnement ne s'applique que sur des anciennes catégories. Vous ne recevrez donc aucun email. Vous pouvez le supprimer
        ou le mettre à jour.
      </Alert>
    )
  } else if (someInactiveCategories.length > 0) {
    return (
      <Alert severity="warning" sx={{ml: 4, mr: 4}}>
        Cet abonnement est actif mais s'applique sur {someInactiveCategories.length} ancienne(s) catégorie(s) (
        {someInactiveCategories.join(', ')}). Mettez le à jour pour supprimer les anciennes catégories.
      </Alert>
    )
  } else if (allInactiveTags) {
    return (
      <Alert severity="error" sx={{ml: 4, mr: 4}}>
        Cet abonnement ne s'applique que sur des anciens tags. Vous ne recevrez donc aucun email. Vous pouvez le supprimer ou le
        mettre à jour.
      </Alert>
    )
  } else if (someInactiveTags.length > 0) {
    return (
      <Alert severity="warning" sx={{ml: 4, mr: 4}}>
        Cet abonnement est actif mais s'applique sur {someInactiveTags.length} ancien(s) tag(s) ({someInactiveTags.join(', ')}).
        Mettez le à jour pour supprimer les anciens tags.
      </Alert>
    )
  } else if (countryAndDepartementAtTheSameTime) {
    return (
      <Alert severity="error" sx={{ml: 4, mr: 4}}>
        Un abonnement ne peut pas s'appliquer à la fois sur un département français et sur un pays étranger. Vous ne recevrez
        aucun email si vous le modifiez pas.
      </Alert>
    )
  } else {
    return (
      <Alert severity="info" sx={{ml: 4, mr: 4}}>
        <div
          dangerouslySetInnerHTML={{
            __html: `Vous recevrez un email <b>${frequency}</b> concernant tout nouveau signalement${all}`,
          }}
        />
      </Alert>
    )
  }
}
