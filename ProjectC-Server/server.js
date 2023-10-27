const express = require('express');
const app = express();
const cors = require('cors');
var mysql = require('mysql');

app.use(cors());


var db  = mysql.createConnection({
    host            : '145.24.222.229', // localhost or 145.24.222.229
    user            : 'caverogroep2',
    password        : 'test1234',
    database        : 'caverogroep2',
    port            : '8321'
});

db.connect();

app.get('/', (request, response) => {
    console.log("Server on");
})

app.get('/users', (request, response) => {
    db.query("SELECT * FROM accounts", (error, result) => {
        response.send(result);
    });
})

app.get('/user_find/:email&:ww', (request, response) => {
    const email = request.params.email;
    const ww = request.params.ww;
    db.query(`SELECT id FROM accounts WHERE Email = "${email}" AND Wachtwoord = "${ww}"`, (error, result) => {
        if (error) console.log(error);

        response.send(result);
    });
})

app.post('/insert_news', (req, res) => {
    const { title, description } = req.body;
    
    const sql = 'INSERT INTO news (title, description) VALUES (?, ?)';
    db.query(sql, [title, description], (err, result) => {
        if (err) {
            console.log(error)
            res.status(500).json({ message: 'Error inserting data' });
        } else {
            res.status(200).json({ message: 'Data inserted successfully' });
        }
    });
});

app.get('/nieuws', (req, res) => {
    const sql = 'SELECT * FROM news';
    db.query(sql, (err, results) => {
        if (err) {
        console.log(error)
        res.status(500).json({ message: 'Error retrieving data' });
        } else {
        res.send(results)
        }
    });
});

app.listen(8080, () => {
    console.log("Server listing");
})