const express = require('express');
const app = express();
const cors = require('cors');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const sha1 = require('sha1');

var mysql = require('mysql');

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: 'userID',
    secret: 'secret', // secret key used to encrypt the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Max duration is 1 day
    }
}))

var db = mysql.createConnection({
    host: '145.24.222.229', // localhost or 145.24.222.229
    user: 'caverogroep2',
    password: 'test1234',
    database: 'caverogroep2',
    port: '8321'
});

db.connect();

app.get('/', (req, res) => {
    console.log("Server on");
})

app.get('/users', (req, res) => {
    db.query("SELECT * FROM accounts", (error, result) => {
        res.send(result);
    });
})

// Login GET
app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
})

// Login POST
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = sha1(req.body.password);

    db.query(`SELECT * FROM accounts WHERE Email = '${email}' AND Wachtwoord = '${password}'`, (error, result) => {
        if (error) res.send(false);

        if (result.length > 0) {
            // Create session with user results
            req.session.user = {
                ID: result[0].ID,
                Email: result[0].Email,
                Password: result[0].Wachtwoord,
                FirstName: result[0].Voornaam,
                LastName: result[0].Achternaam,
                Level: result[0].Level
            };

            // Send JSON array back with data
            res.json({
                Login: true,
                ID: result[0].ID,
                Email: result[0].Email,
                Password: result[0].Wachtwoord,
                FirstName: result[0].Voornaam,
                LastName: result[0].Achternaam,
                Level: result[0].Level
            });
        }
    });
})

// Logout GET
app.get("/signout", (req, res) => {
    res.clearCookie("userID");
    res.send({ signedOut: true });
    res.end();
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

app.get('/news', (req, res) => {
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

app.get('/events', (request, response) => {
    db.query("SELECT * FROM events", (error, result) => {
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