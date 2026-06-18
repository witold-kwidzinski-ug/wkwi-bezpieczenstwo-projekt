import { useEffect, useState } from "react"
import Game from "../components/Game"
import keycloak from "../keycloak"

export default function Public() {

    const [games, setGames] = useState([])
    const [fav, setFav] = useState([])

    useEffect(() => {
        async function getGames() {
            const games = await fetch("/api/games").then(o => o.json())
            setGames(games)

            if (keycloak.token !== null) {
                const favs = await fetch("/api/favourites", {
                    headers: {Authorization: `Bearer ${keycloak.token}`}
                }).then(o => o.json())
                setFav(favs)
            }

        }

        getGames()

    }, [])


    
    return (
        <>
            <h1 style={{color: "white", textAlign: "center"}}>Public</h1>
            <div id="gamegrid">
                {games.length > 0 && games.map((n, i) => fav.some(o => o.id === n.id) ? (<Game id={`${i}${n.id}`} game={n} fav={games.filter(n => fav.some(o => o.id === n.id))} setFav={setFav} style={{filter: "grayscale(100%)"}}></Game>) : (<Game id={`${i}${n.id}`} game={n} fav={games.filter(n => fav.some(o => o.id === n.id))} setFav={setFav}></Game>))}
            </div>
        </>
        
    )

}