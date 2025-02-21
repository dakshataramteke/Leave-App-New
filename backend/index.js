const express = require("express");
const app = express();
const port = 5000;
const connection = require('./models/db');
const cors = require('cors');
const path = require('path');
const { console } = require("inspector");

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("<h1>Admin Page</h1><p>For all the data use <a href='/allpending'>/allpending</a></p>");
});

app.get("/allpending", async (req, res) => {
    try {
        const sql = "SELECT * FROM leave_request";
        const images = "SELECT * FROM images_data";
        connection.query(selectImageDataQuery, (imageDataErr, imageDataResult) => {
            if (imageDataErr) {
                console.error('Error executing image_data select query:', imageDataErr);
                return res.status(500).send('Error retrieving image data');
            }})
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