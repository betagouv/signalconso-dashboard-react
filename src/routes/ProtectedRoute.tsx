import {Navigate} from 'react-router-dom'
import {UserWithPermission} from '../core/client/authenticate/Authenticate'

interface ProtectedRouteProps {
  children: React.ReactNode
  auth: UserWithPermission | undefined // true if authenticated, false otherwise
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({auth, children}) => {
  if (auth) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
