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

var db  = mysql.createConnection({
    host            : '145.24.222.229', // localhost or 145.24.222.229
    user            : 'caverogroep2',
    password        : 'test1234',
    database        : 'caverogroep2',
    port            : '8321'
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
            res.json({ Login: true,
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

app.listen(8080, () => {
    console.log("Server listing");
})