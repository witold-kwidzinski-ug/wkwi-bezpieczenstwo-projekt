import keycloak from "../keycloak"

export default function FavButton({game, selected, setFav}) {

    async function buttonClick() {
        if (!selected) {
            console.log("You like it!")
            try {
                const d = await fetch("/api/games/fav", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${keycloak.token}`
                        },
                        method: "POST",
                        body: JSON.stringify({gameid: game.id})
                    }).then(o => o.json())


                    setFav(p => [...p, {...game, userid: d.userid}])
                
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log("You hate it.")
            try {
                const d = await fetch("/api/games/unfav", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${keycloak.token}`
                        },
                        method: "DELETE",
                        body: JSON.stringify({gameid: game.id})
                    })

                    setFav(p => p.filter(n => n.id !== game.id))

                
            } catch (err) {
                console.log(err)
            }
        }
        
    }

    return (
        <button onClick={buttonClick}>{selected ? "★" : "☆"}</button>
    )
}