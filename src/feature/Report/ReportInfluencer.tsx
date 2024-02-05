import {Influencer} from '../../core/client/report/Report'
import {Box, Icon} from '@mui/material'
import {Txt} from '../../alexlibs/mui-extension'
import React from 'react'
import youtubeLogo from './ReportCompany/youtube.svg'
import facebookLogo from './ReportCompany/facebook.svg'
import instagramLogo from './ReportCompany/instagram.svg'
import tiktokLogo from './ReportCompany/tiktok.svg'
import twitterLogo from './ReportCompany/twitter.svg'
import linkedinLogo from './ReportCompany/linkedin.svg'
import snapchatLogo from './ReportCompany/snapchat.svg'
import twitchLogo from './ReportCompany/twitch.svg'
import questionMarkLogo from './ReportCompany/questionmark.svg'

interface Props {
  influencer: Influencer
}
export const ReportInfluencer = ({influencer}: Props) => {
  const socialNetworkIcon = (socialNetwork?: string) => {
    switch (socialNetwork) {
      case 'YouTube':
        return youtubeLogo
      case 'Facebook':
        return facebookLogo
      case 'Instagram':
        return instagramLogo
      case 'TikTok':
        return tiktokLogo
      case 'Twitter':
        return twitterLogo
      case 'LinkedIn':
        return linkedinLogo
      case 'Snapchat':
        return snapchatLogo
      case 'Twitch':
        return twitchLogo
      default:
        return questionMarkLogo
    }
  }

  return (
    <>
      <Box
        sx={{
          m: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={socialNetworkIcon(influencer.socialNetwork)}
          alt={influencer.socialNetwork}
          sx={{
            height: 24,
            width: 24,
          }}
        />
        {influencer.socialNetwork && <Txt sx={{ml: 1}}>{influencer.socialNetwork}</Txt>}
        {influencer.otherSocialNetwork && <Txt sx={{ml: 1}}>{influencer.otherSocialNetwork}</Txt>}
      </Box>
      <Box
        sx={{
          m: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon>person</Icon>
        <Txt sx={{ml: 1}}>{influencer.name}</Txt>
      </Box>
    </>
  )
}
