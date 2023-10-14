const express = require('express');
const app = express();
const cors = require('cors');
var mysql = require('mysql');

app.use(cors());


var db  = mysql.createConnection({
  host            : 'localhost', // localhost or 145.24.222.229
  user            : 'root',
  password        : '',
  database        : 'temp'
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

app.get('/login/:email&:ww', (request, response) => {
    const email = request.params.email;
    const ww = request.params.ww;
    db.query(`SELECT * FROM accounts WHERE Email = "${email}" AND Wachtwoord = SHA1("${ww}")`, (error, result) => {
        if (error) console.log(error);

        response.send(result);
    });
})

app.listen(8080, () => {
    console.log("Server listing");
})