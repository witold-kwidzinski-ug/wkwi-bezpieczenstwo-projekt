import keycloak from "./keycloak"

export default function ProtectedRoute({children}) {
    const loggedIn = keycloak.authenticated

    if (!loggedIn) {
        keycloak.login({redirectUri: window.location.href})
        return null
    }

    return children
}