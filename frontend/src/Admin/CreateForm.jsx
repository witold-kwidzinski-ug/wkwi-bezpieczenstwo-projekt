import keycloak from "../keycloak"
import { useState } from "react"

export default function CreateForm({setNotif}) {
    const [name, setName] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(name)

        async function sendItem() {
            try {
                const res = await fetch("/api/games/add", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${keycloak.token}`
                    },
                    method: "POST",
                    body: JSON.stringify({name})
                }).then(o => o.json())
                setNotif(`Game titled "${res.name}" successfully added.`) 
                setName("")
            } catch (err) {
                console.log(err)
                setNotif(`Game was not added!`) 
            }
        }

        sendItem()
        
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="itemName" placeholder="Add game" onChange={e => setName(e.target.value)} value={name} />
                <button>Add</button>
            </form>
        </>
    )
}