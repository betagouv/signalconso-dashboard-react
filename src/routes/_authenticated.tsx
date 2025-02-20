import {createFileRoute, Outlet, redirect, useLocation} from "@tanstack/react-router";
import {ConnectedContextProvider} from "../core/context/ConnectedContext";
import {useEffect, useMemo} from "react";
import {buildConnectedApiSdks} from "../core/apiSdkInstances";
import {trackPage} from "../core/plugins/Matomo";
import {RefreshBanner} from "../shared/RefreshBanner";
import {useLoginManagement} from "../core/useLoginManagement";

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.loginManagementResult.isAuthenticated()) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
    const {
    connectedUser,
    setConnectedUser,
    handleDetectedLogout,
  } = useLoginManagement()
    const apiSdk = useMemo(
    () =>
      buildConnectedApiSdks({
        onDisconnected: handleDetectedLogout,
      }),
    [handleDetectedLogout],
  )

    const location = useLocation()
  useEffect(() => {
    if (connectedUser) {
      trackPage(
        `/${connectedUser.role.toLocaleLowerCase()}${location.pathname}`,
        connectedUser,
      )
    }
  }, [connectedUser, location])

  return connectedUser && (
    <ConnectedContextProvider connectedUser={connectedUser} setConnectedUser={setConnectedUser} api={apiSdk}>
      <RefreshBanner />
      <Outlet />
    </ConnectedContextProvider>
  )
}