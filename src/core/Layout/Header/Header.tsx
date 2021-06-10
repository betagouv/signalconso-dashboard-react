import {makeStyles} from '@material-ui/core/styles'
import {Theme} from '@material-ui/core'
import logoGouv from './gouv.svg'
import logoSignalConso from './signalconso.svg'
import {useI18n} from '../../i18n'
import {Btn} from 'mui-extension/lib'
import {Config} from '../../../conf/config'
import {utilsStyles} from 'core/theme'
import {headerHeight} from '../index'
import React from 'react'
import {MenuBtn} from '../Menu/MenuBtn'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    minHeight: headerHeight,
    padding: t.spacing(.5, 2),
    display: 'flex',
    alignItems: 'center',
    background: t.palette.background.paper,
    borderBottom: '1px solid ' + t.palette.divider,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoGouv: {
    height: 120,
    marginRight: t.spacing(3),
  },
  logoSignalConso: {
    height: 60,
    marginRight: t.spacing(1),
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },

}))

export const Header = () => {
  const css = useStyles()
  const {m} = useI18n()
  return (
    <div className={css.root}>
      <div className={css.logo}>
        <img src={logoGouv} alt={m.altLogoGouv} className={css.logoGouv}/>
        <a href={Config.appBaseUrl}>
          <img src={logoSignalConso} alt={m.altLogoSignalConso} className={css.logoSignalConso}/>
        </a>
      </div>
      <div className={css.menu}>
        <HeaderItem href="">{m.home}</HeaderItem>
        <HeaderItem href="comment-ça-marche">{m.howItWorks}</HeaderItem>
        <HeaderItem href="centre-aide/consommateur">{m.helpCenter}</HeaderItem>
        <MenuBtn/>
      </div>
    </div>
  )
}

const useHeaderItemStyles = makeStyles((t: Theme) => ({
  root: {
    textTransform: 'initial',
    fontSize: utilsStyles(t).fontSize.big,
    padding: t.spacing(0, 2),
  }
}))

const HeaderItem = ({children, href}: {children: any, href: string}) => {
  const css = useHeaderItemStyles()
  return (
    <Btn color="primary" href={Config.appBaseUrl + '/' + href} className={css.root}>{children}</Btn>
  )
}
