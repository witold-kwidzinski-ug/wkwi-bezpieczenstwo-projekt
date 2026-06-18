import { useState } from "react"
import CreateForm from "./CreateForm"
import RemoveForm from "./RemoveForm"

export default function Admin() {

    const [notif, setNotif] = useState("")


    return (
        <>
            <h1 style={{color: "white", textAlign: "center"}}>Admin</h1>
            <h2>{notif}</h2>
            <CreateForm setNotif={setNotif} />
            <RemoveForm setNotif={setNotif} />

        </>
    )

}