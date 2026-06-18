import { Navigate } from "react-router-dom"
import keycloak from "./keycloak"

export default function AdminRoute({children}) {
    const roles = keycloak.tokenParsed?.realm_access?.roles || []

    const canAccess = roles.includes("ADMIN")


    if (!keycloak.authenticated) {
        keycloak.login({redirectUri: window.location.href})
        return null
    }

    if (!canAccess) {
        return <Navigate to="/" />
    }

    return children;
}