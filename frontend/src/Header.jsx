import { Link } from "react-router-dom";
import keycloak from "./keycloak";

export default function Header() {

    function handleLogout(e) {
        e.preventDefault()

        keycloak.logout({
            redirectUri: window.location.origin,
        })

    }

    function handleLogin(e) {
        e.preventDefault()

        keycloak.login({
            redirectUri: window.location.origin,
        })

    }


    return (
        <div id="header">
            <h1>GameLibrary</h1>
            <div id="header-options">
                <Link to="/">Public</Link>
                <Link to="/favourites">Favourites</Link>
                {keycloak.authenticated && keycloak.tokenParsed.realm_access.roles.includes("ADMIN") && <Link to="/admin" style={{color: "cornflowerblue"}}>Admin</Link>}
                {keycloak.authenticated ? <Link to="#" onClick={handleLogout}>Logout</Link> : <Link to="#" onClick={handleLogin}>Login</Link> }
                {keycloak.authenticated && <p style={{color: "rgb(100, 100, 100)"}}>{`Logged in as: ${keycloak.tokenParsed.preferred_username}`}</p>}
            </div>
        </div>
    )
}