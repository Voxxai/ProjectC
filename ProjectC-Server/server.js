const express = require('express');
const app = express();
const cors = require('cors');
var mysql = require('mysql');

app.use(cors());


var db  = mysql.createConnection({
  host            : '145.24.222.229', // localhost or 145.24.222.229
  user            : 'root',
  password        : 'Z47pQnc',
  database        : 'caverogroep2'
});

db.connect();

app.get('/', (request, response) => {
    db.query("SELECT * FROM accounts", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
        db.end();
    });
})

app.listen(8080, () => {
    console.log("Server listing");
})