import {
  Box,
  BoxProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from '@mui/material'
import React from 'react'
import { ScMenu } from '../../shared/Menu'
import antidropIcon from './img/antidrop.png'
import whoisIcon from './img/whois.png'
import webIcon from './img/web.webp'
import internetArchiveIcon from './img/internetArchive.svg'
import scamdocIcon from './img/scamdoc.png'
import { useI18n } from '../../core/i18n'

import { WebsiteWithCompany } from '../../core/client/website/Website'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toastContext'
import { WebsiteWithCompanySearchKeys } from '../../core/queryhooks/websiteQueryHooks'
import { SiretExtraction } from './SiretExtraction'

interface WebsiteActionsProps extends BoxProps {
  website: WebsiteWithCompany
  onRemove: (id: string) => Promise<any>
}

const websiteAnalyzeTool = [
  {
    label: 'Consulter le site',
    img: webIcon,
    url: (website: string) => website,
  },
  {
    label: 'Antidrop',
    img: antidropIcon,
    url: (website: string) => `https://antidrop.fr`,
  },
  {
    label: 'Whois',
    img: whoisIcon,
    url: (website: string) => `https://who.is/whois/${website}`,
  },
  {
    label: 'The Internet Archive',
    img: internetArchiveIcon,
    url: (website: string) => `https://web.archive.org/web/*/${website}`,
  },
  {
    label: 'ScamDoc',
    img: scamdocIcon,
    url: (website: string) => `https://www.scamdoc.com`,
  },
]

export const WebsiteTools = ({ website, onRemove }: WebsiteActionsProps) => {
  const { m } = useI18n()
  const { api } = useApiContext()
  const queryClient = useQueryClient()
  const { toastError, toastSuccess } = useToast()

  const _extractSiret = useMutation({
    mutationFn: () => api.secured.siretExtractor.extractSiret(website.host),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: WebsiteWithCompanySearchKeys,
      }),
    onError: () =>
      toastError({
        message: "Une erreur est survenue dans le service d'extraction.",
      }),
  })

  return (
    <Tooltip title={m.identicationTools}>
      <ScMenu icon="travel_explore">
        {websiteAnalyzeTool.map((tool) => (
          <MenuItem
            key={tool.label}
            onClick={() => window.open(tool.url(website.host), '_blank')}
          >
            <ListItemIcon>
              <Box
                component="img"
                src={tool.img}
                alt={tool.label}
                sx={{
                  height: 18,
                }}
              />
            </ListItemIcon>
            <ListItemText>{tool.label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem key="siret_extraction" onClick={() => _extractSiret.mutate()}>
          <SiretExtraction
            websiteWithCompany={website}
            siretExtraction={_extractSiret.data}
            isLoading={_extractSiret.isPending}
            remove={() => onRemove(website.id)}
            identify={() =>
              queryClient.invalidateQueries({
                queryKey: WebsiteWithCompanySearchKeys,
              })
            }
          >
            <div>Extraire un SIRET/SIREN</div>
          </SiretExtraction>
        </MenuItem>
      </ScMenu>
    </Tooltip>
  )
}
