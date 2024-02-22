import {Icon} from '@mui/material'
import {Influencer} from '../../core/client/report/Report'
import facebookLogo from './ReportCompany/facebook.svg'
import instagramLogo from './ReportCompany/instagram.svg'
import linkedinLogo from './ReportCompany/linkedin.svg'
import questionMarkLogo from './ReportCompany/questionmark.svg'
import snapchatLogo from './ReportCompany/snapchat.svg'
import tiktokLogo from './ReportCompany/tiktok.svg'
import twitchLogo from './ReportCompany/twitch.svg'
import twitterLogo from './ReportCompany/twitter.svg'
import youtubeLogo from './ReportCompany/youtube.svg'

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
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <img className="h-[20px] w-[20]px" src={socialNetworkIcon(influencer.socialNetwork)} alt={influencer.socialNetwork} />
        {influencer.socialNetwork && <span>{influencer.socialNetwork}</span>}
        {influencer.otherSocialNetwork && <span>{influencer.otherSocialNetwork}</span>}
      </div>
      <div className="flex items-center gap-1">
        <Icon>person</Icon>
        <span>{influencer.name}</span>
      </div>
    </div>
  )
}
