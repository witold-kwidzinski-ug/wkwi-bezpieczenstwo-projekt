import { useEffect, useState } from "react"
import Game from "../components/Game"
import keycloak from "../keycloak"

export default function Favourites() {

    const [games, setGames] = useState([])

    useEffect(() => {
        async function getGames() {
            const favs = await fetch("/api/favourites", {
                    headers: {Authorization: `Bearer ${keycloak.token}`}
                }).then(o => o.json())
            setGames(favs)
        }

        getGames()

    }, [])


    return (
        <>
            <h1 style={{color: "white", textAlign: "center"}}>Favourites</h1>
            <div id="gamegrid">
                {games.length > 0 && games.map((n, i) => (<Game id={`${i}${n.id}`} game={n} fav={games} setFav={setGames}></Game>))}
            </div>
        </>
        
    )
}