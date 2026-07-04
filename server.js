const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());

// Health check (Railway wichtig)
app.get("/", (req, res) => {
    res.send("Zug API läuft 🚆");
});

// 🔍 Locations (Autocomplete)
app.get("/locations", async (req, res) => {

    const q = req.query.q;

    try {
        const response = await fetch(
            `https://v6.db.transport.rest/locations?query=${encodeURIComponent(q)}&results=6&poi=false&addresses=false`
        );

        const data = await response.json();
        res.json(data);

catch (err) {
    console.error(err);
    res.status(500).json({
        error: err.message
    });
}
});

// 🚆 Journeys
app.get("/journeys", async (req, res) => {

    const { from, to } = req.query;

    try {
        const response = await fetch(
            `https://v6.db.transport.rest/journeys?from=${from}&to=${to}&results=5`
        );

        const data = await response.json();
        res.json(data);

    } catch (err) {
    console.error(err);
    res.status(500).json({
        error: err.message
    });
}

// Railway nutzt PORT automatisch
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server läuft auf Port", PORT);
});