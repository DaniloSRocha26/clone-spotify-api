const express = require("express")
const querystring = require("querystring")
const openurl = require("openurl")
const axios = require("axios")
let accessToken = null
let refreshToken = null

CLIENT_ID = your_spotify_client_id
CLIENT_SECRET = your_spotify_client_secret
REDIRECT_URI = "http://127.0.0.1:8888/callback"

var app = express()

app.listen("8888", () => {
    console.log("Listening to port 8888...")

    openurl.open("http://127.0.0.1:8888/login")
})

app.get("/login", (req, res) => {
    var scope =
        "user-read-private user-read-email user-modify-playback-state user-read-playback-state streaming"

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: REDIRECT_URI
            })
    )
})

app.get("/callback", async (req, res) => {
    var code = req.query.code

    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code"
        }),
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString(
                        "base64"
                    )
            }
        }
    )

    accessToken = response.data.access_token
    refreshToken = response.data.refresh_token

    await playTrack()
    res.send("Authorization successful! You can close this window.")
})

app.get("/refresh", async (req, res) => {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "refresh_token",
                refresh_token: refreshToken
            }),
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString(
                            "base64"
                        )
                }
            }
        )

        accessToken = response.data.access_token

        if (response.data.refresh_token) {
            refreshToken = response.data.refresh_token
        }

        console.log("Access token refreshed!")
        res.send("Access token refreshed!")
    } catch (err) {
        console.error(
            "Error refreshing token:",
            err.response?.data || err.message
        )
        res.status(500).send("Failed to refresh token.")
    }
})

async function playTrack() {
    const trackUri = "spotify:track:6rUp7v3l8yC4TKxAAR5Bmx"

    await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        { uris: [trackUri] },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        }
    )
}
