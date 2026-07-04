const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());

// Health check
app.get("/", (req, res) => {
    res.send("Zug API läuft 🚆");
});

// 🔍 Locations (FIXED + SAFE)
app.get("/locations", async (req, res) => {

    const q = req.query.q;

    try {
        const response = await fetch(
            `https://v6.db.transport.rest/locations?query=${encodeURIComponent(q)}&results=6&poi=false&addresses=false`
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.log("Invalid JSON from API:", text);
            return res.status(500).json({ error: "Invalid API response" });
        }

        res.json(data);

    } catch (err) {
        console.error("Locations error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 🚆 Journeys (SAFE)
app.get("/journeys", async (req, res) => {

    const { from, to } = req.query;

    try {
        const response = await fetch(
            `https://v6.db.transport.rest/journeys?from=${from}&to=${to}&results=5`
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.log("Invalid JSON from API:", text);
            return res.status(500).json({ error: "Invalid API response" });
        }

        res.json(data);

    } catch (err) {
        console.error("Journeys error:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server läuft auf Port", PORT);
});