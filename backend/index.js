const express = require("express");
const app = express();
const port = 5000;
const connection = require('./models/db');
const cors = require('cors');
const path = require('path');
const { console } = require("inspector");

app.use(cors());
app.use(express.json());

app.get("/allpending", async (req, res) => {
    try {
        const sql = "SELECT * FROM leave_request";
        const [result] = await connection.query(sql);
        // console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/approved', (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});