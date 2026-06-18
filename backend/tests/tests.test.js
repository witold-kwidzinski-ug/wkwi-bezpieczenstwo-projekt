const request = require("supertest")
const app = require("../app")
const DB = require("../db")
const jwt = require("jsonwebtoken")


jest.mock("../db", () => ({
    query: jest.fn()
}))
afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

test("GET /health", async () => {
    DB.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get("/health")

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe("ok")
})

test("GET /games", async () => {
    DB.query.mockResolvedValue({rows: [{id: 1, name: "gra"}, {id: 2, name: "kolejna"}]})
    
    const res = await request(app).get("/games")

    expect(res.statusCode).toBe(200)
    expect(res.body[0].id).toBe(1)
    expect(res.body[0].name).toBe("gra")
    expect(res.body[1].id).toBe(2)
    expect(res.body[1].name).toBe("kolejna")
})

test("GET /favourites returns 401", async () => {
    const res = await request(app).get("/favourites")

    expect(res.statusCode).toBe(401)
})

test("GET /favourites approved", async () => {
    jest.spyOn(jwt, "verify").mockReturnValue({
        sub: "user123"
    })
    DB.query.mockResolvedValue({rows: [{userid: 123, gameid: 1, name: "gra"}]})

    const res = await request(app).get("/favourites").set("Authorization", "Bearer token")

    expect(res.statusCode).toBe(200)
    expect(res.body[0].userid).toBe(123)
    expect(res.body[0].gameid).toBe(1)
    expect(res.body[0].name).toBe("gra")


})

test("GET /favourites invalid token", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("Invalid token");
        });

    const res = await request(app).get("/favourites").set("Authorization", "Bearer token");

    expect(res.statusCode).toBe(401);
});


test("POST /games/add with admin", async() => {
    jest.spyOn(jwt, "verify").mockReturnValue({
        sub: "user123",
        realm_access: {
            roles: ["ADMIN"]
        }
    })
    DB.query.mockResolvedValueOnce({}).mockResolvedValueOnce({rows: [{gameid: 3, name: "nastepna"}]})

    const res = await request(app).post("/games/add").set("Authorization", "Bearer token").send({name: "nastepna"})

    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe("nastepna")


})

test("POST /games/add without admin", async() => {
    jest.spyOn(jwt, "verify").mockReturnValue({
        sub: "user123",
        realm_access: {
            roles: []
        }
    })
    DB.query.mockResolvedValueOnce({}).mockResolvedValueOnce({rows: [{gameid: 3, name: "nastepna"}]})

    const res = await request(app).post("/games/add").set("Authorization", "Bearer token").send({name: "nastepna"})

    expect(res.statusCode).toBe(403)


})