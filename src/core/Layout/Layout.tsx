import * as React from 'react'
import {ReactNode} from 'react'
import {LayoutProvider} from './LayoutContext'
import {Header} from './Header/Header'
import {Roles} from '@signal-conso/signalconso-api-sdk-js'

export const sidebarWith = 220

export interface LayoutConnectedUser {
  firstName: string
  lastName: string
  email: string
  role: Roles
  logout: () => void
}

export interface LayoutProps {
  title?: string
  children?: ReactNode
  mobileBreakpoint?: number
  connectedUser?: LayoutConnectedUser
}

export const Layout = ({title, mobileBreakpoint, children, connectedUser}: LayoutProps) => {
  return (
    <LayoutProvider title={title} mobileBreakpoint={mobileBreakpoint}>
      <LayoutUsingContext connectedUser={connectedUser}>{children}</LayoutUsingContext>
    </LayoutProvider>
  )
}

const LayoutUsingContext = ({children, connectedUser}: any) => {
  return (
    <>
      <Header connectedUser={connectedUser} />
      <main style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>{children}</main>
    </>
  )
}
