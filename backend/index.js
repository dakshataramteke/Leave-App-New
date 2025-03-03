const express = require("express");
const app = express();
const port = 5000;
const connection = require('./models/db');
const cors = require('cors');
const path = require('path');
const { console } = require("inspector");
const session = require("express-session"); 

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'leave app', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

/*

=== All Pending Data ===     

*/
app.get("/allpending", async (req, res) => {
    console.log("Data Received ");
   try{
        const sql = "SELECT * FROM leave_request";
        console.log(req);
        const [result] = await connection.query(sql);
        console.log(result);
        res.send(result);
    }catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/approved', (req, res) => {
    console.log("GET request received at /approved");
    console.log("Request body:", req.body);
    res.json(`Logged in as ${req.session}`);
});

app.post('/approved', (req, res) => {
    console.log("POST request received at /approved");
    console.log("Request body:", req.body);
    res.send(`Logged in as ${req.session}`);
});


app.get('/rejected', (req, res) => {
    console.log("GET request received at rejected");
    console.log("Request body:", req.body);
    res.json(req.body);
});
app.post("/rejected",(req,res)=>{
    console.log("POST request received at /rejected");
    console.log("Request body:", req.body);
    res.json(`Logged in as ${req.session}`);
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

