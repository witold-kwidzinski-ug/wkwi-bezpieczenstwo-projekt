import keycloak from "../keycloak"
import { useState } from "react"

export default function CreateForm({setNotif}) {
    const [id, setId] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(id)

        async function sendItem() {
            try {
                const res = await fetch("/api/games/remove", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${keycloak.token}`
                    },
                    method: "DELETE",
                    body: JSON.stringify({gameid: id})
                })
                if (res.status !== 200) {
                    return false
                }      
                setNotif(`Game with id "${id}" successfully removed.`) 
                setId("")
            } catch (err) {
                console.log(err)       
                setNotif(`Game was not removed!`) 
            }
        }

        sendItem()
        
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="itemId" placeholder="Remove" onChange={e => setId(e.target.value)} value={id} />
                <button>Remove</button>
            </form>
        </>
    )
}