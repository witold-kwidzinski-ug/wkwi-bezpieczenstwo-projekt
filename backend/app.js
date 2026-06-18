require("dotenv").config()
const express = require("express")
const cors = require("cors")
const DB = require("./db")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors(), express.json())

const startTime = Date.now()


app.get("/games", async (req, res) => {
    try {
        const items = await DB.query("SELECT * FROM games")
        res.send(items.rows)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})



app.get("/health", async (req, res) => {
    const resObj = {status: "ok", uptime: Math.floor((Date.now() - startTime) / 1000)}

    try {
        await DB.query('SELECT 1 FROM games')
        resObj.postgres = true
    } catch (err) {
        resObj.postgres = false
    }
    

    res.json(resObj)
})

// user protected

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.sendStatus(401);

    try {
        const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`

        const decoded = jwt.verify(token, public_key, {algorithms: ["RS256"]})
        req.decoded = decoded
        next()
    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }

    
}

app.get("/favourites", authenticate, async (req, res) => {
    try {
        const userid = req.decoded.sub

        const data = await DB.query(`SELECT g.* FROM games g JOIN favourites f ON f.gameid=g.id WHERE f.userid=$1`, [userid])

        res.send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }


})


app.post("/games/fav", authenticate, async (req, res) => {
    try {
        const gameid = req.body.gameid
        const userid = req.decoded.sub
        await DB.query(`INSERT INTO favourites (userid, gameid) VALUES ($1, $2)`, [userid, gameid])

        const record = await DB.query('SELECT * FROM favourites WHERE userid=$1 AND gameid=$2 ', [userid, gameid])

        res.send(record.rows[0])
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

})


app.delete("/games/unfav", authenticate, async (req, res) => {
    try {
        const gameid = req.body.gameid
        const userid = req.decoded.sub
        await DB.query(`DELETE FROM favourites WHERE userid=$1 AND gameid=$2`, [userid, gameid])

        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

})


// admin protected

function isAdmin(req, res, next) {
    const roles = req.decoded.realm_access.roles || [];

    console.log(`role: ${roles}`)

    if (roles.includes("ADMIN")) {
        next()
    } else {
        res.sendStatus(403)
    }
}

app.post("/games/add", authenticate, isAdmin, async (req, res) => {
    try {
        const name = req.body.name
        await DB.query(`INSERT INTO games (name) VALUES ($1)`, [name])

        const record = await DB.query('SELECT * FROM games WHERE name=$1 ', [name])

        res.send(record.rows[0])

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

})


app.delete("/games/remove", authenticate, isAdmin, async (req, res) => {
    try {
        const gameid = req.body.gameid
        await DB.query(`DELETE FROM games WHERE id=$1`, [gameid])

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

})

module.exports = app