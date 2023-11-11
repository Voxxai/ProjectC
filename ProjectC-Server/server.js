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

app.get('/login/:email&:ww', (request, response) => {
    const email = request.params.email;
    const ww = request.params.ww;
    db.query(`SELECT * FROM accounts WHERE Email = "${email}" AND Wachtwoord = SHA1("${ww}")`, (error, result) => {
        if (error) console.log(error);

        response.send(result);
    });
})

function formatDate(date) {
    const hoursToAdd = 1 * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

app.get('/events', (request, response) => {
    
    db.query("SELECT * FROM events", (error, result) => {
        response.send(result.map((event) => {
            return {
                ID: event.ID,
                Date: formatDate(event.Date),
                Title: event.Title,
                Description: event.Description,
                Location: event.Location,
                Level: event.Level
            }
        }));
    });
})

app.get('/events/:date', (request, response) => {
    db.query(`SELECT * FROM events WHERE Date = "${request.params.date}"`, (error, result) => {
        if (error) console.log(error);
        
        response.send(result.map((event) => {
            return {
                ID: event.ID,
                Date: formatDate(event.Date),
                Title: event.Title,
                Description: event.Description,
                Location: event.Location,
                Level: event.Level
            }
        }));
    });
})


app.get('/users_day/:date', (request, response) => {
    db.query(`SELECT accounts.Voornaam, accounts.Achternaam, Werknemer_rooster.Date FROM Werknemer_rooster LEFT JOIN accounts ON Werknemer_rooster.Account_ID=accounts.ID WHERE Date = "${request.params.date}"`, (error, result) => {
        if (error) console.log(error);
        
        response.send(result);
    });
})

app.listen(8080, () => {
    console.log("Server listing");
})