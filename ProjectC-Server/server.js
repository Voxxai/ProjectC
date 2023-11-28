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

app.post('/user_update', (req, res) => {
    const ID = req.body.ID;
    const Email = req.body.Email;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;

    db.query("UPDATE accounts SET Email=?, FirstName=?, LastName=? WHERE ID = ?", [Email, FirstName, LastName, ID], (error, result) => {
        if (error) res.send(false);

        res.send(true);
    });


})

//Update Session cookie
app.post("/session_update", (req, res) => {
    const Email = req.body.Email;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;

    if (req.session.user) {
        req.session.user = {
            ID: req.session.ID,
            Email: Email,
            Password: req.session.Wachtwoord,
            FirstName: FirstName,
            LastName: LastName,
            Level: req.session.Level
        };

        req.session.save();
        res.send(true);
    } else {
        res.send(false);
    }
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
    const password = req.body.password;

    db.query(`SELECT * FROM accounts WHERE Email = '${email}' AND Password = '${password}'`, (error, result) => {

        if (error) res.send(false);

        if (result.length > 0) {
            // Create session with user results
            req.session.user = {
                ID: result[0].ID,
                Email: result[0].Email,
                Password: result[0].Password,
                FirstName: result[0].FirstName,
                LastName: result[0].LastName,
                Level: result[0].Level
            };

            // Send JSON array back with data
            res.json({
                Login: true,
                ID: result[0].ID,
                Email: result[0].Email,
                Password: result[0].Password,
                FirstName: result[0].FirstName,
                LastName: result[0].LastName,
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
    const sql = 'SELECT * FROM news ORDER BY creation_time DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.log(error)
            res.status(500).json({ message: 'Error retrieving data' });
        } else {
            res.send(results)
        }
    });
});

//add event
app.post('/insert_event', (req, res) => {
    const { title, date, time, summary, location, level } = req.body;

    const sql = 'INSERT INTO events (Title, Date, Time, Description, Location, Level) VALUES (?, ?, ?, ?, ?,?)';
    db.query(sql, [title, date, time, summary, location, level], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error inserting event data' });
        } else {
            res.status(200).json({ message: 'Event data inserted successfully' });
        }
    });
});

app.get('/events', (request, response) => {
    db.query("SELECT * FROM events", (error, result) => {
        if (error) {
            console.log(error);
            result.status(500).json({ message: 'Error retrieving event data' });
        } else {
            response.send(result);
        }
    });
})

function formatDate(date) {
    const newDate = new Date(date);
    return newDate;
}

app.get('/events', (request, response) => {

    db.query("SELECT * FROM events", (error, result) => {
        response.send(result.map((event) => {
            return {
                ID: event.ID,
                Date: event.Date,
                Time: event.Time,
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
                Date: event.Date,
                Time: (event.Time.slice(0, -3)),
                Title: event.Title,
                Description: event.Description,
                Location: event.Location,
                Level: event.Level
            }
        }));
    });
})

app.get('/event_users/:ID', (request, response) => {
    db.query(`SELECT accounts.FirstName, accounts.LastName FROM event_users LEFT JOIN accounts ON event_users.User_ID=accounts.ID WHERE Event_ID = "${request.params.ID}"`, (error, result) => {
        if (error) console.log(error);
        
        response.send(result);
    });
})

app.get('/users_day/:date', (request, response) => {
    db.query(`SELECT accounts.FirstName, accounts.LastName, Employee_schedule.Date FROM Employee_schedule LEFT JOIN accounts ON Employee_schedule.Account_ID=accounts.ID WHERE Date = "${request.params.date}"`, (error, result) => {
        if (error) console.log(error);

        response.send(result);
    });
})

app.listen(8080, () => {
    console.log("Server listing");
})