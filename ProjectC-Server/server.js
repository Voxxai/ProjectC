const express = require('express');
const app = express();
const cors = require('cors');

const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueFilename = `${uuid.v4()}${extension}`;
        cb(null, uniqueFilename);
    }
});

var mysql = require('mysql');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const sha1 = require('sha1');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const upload = multer({ storage: storage });

dotenv.config();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use('/images', express.static('images'));

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

// Start connection
db.connect();

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// send Email for 2FA
app.post('/send-email', (req, res) => {
    const { Code, Email } = req.body;

    const mailOptions = {
        from: process.env.USER,
        to: Email,
        subject: "Two-Factor-Authentication Code: " + Code,
        html: "<html>" +
            "<body>" +
            "<div style='width:100%; height:100%; background-color:#f4f4f4; padding:30px;'>" +
            "<div style='width:600px; height: auto; margin:0 auto; padding:25px; border-radius:5px; background-color:white;'>" +
            "<h1 style='color:#7F3689;'>Two-Factor-Authentication Code</h1>" +
            "<p style='color:#919191; font-size:16px; margin-bottom:25px;'>Deze code is voor de komende 5 min geldig. Als u te laat deze code invoert moet u een nieuwe ontvangen.</p>" +
            "<div style='text-align:center; padding:25px; background-color:#fafafa;'>" +
            "<h2 style='color:#7F3689; margin-bottom:10px;'>Code:</h2>" +
            "<p style='color:black; font-size:32px; margin-bottom:25px; letter-spacing: 15px;'>" + Code + "</p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Email sent successfully');
        }
    });
});

// send Email for forgot password
app.post('/forgot-password-email', (req, res) => {
    const { ID, Email } = req.body;

    const mailOptions = {
        from: process.env.USER,
        to: Email,
        subject: "Wachtwoord resetten",
        html: "<html>" +
            "<body>" +
            "<div style='width:100%; height:100%; background-color:#f4f4f4; padding:30px;'>" +
            "<div style='width:600px; height: auto; margin:0 auto; padding:25px; border-radius:5px; background-color:white;'>" +
            "<h1 style='color:#7F3689;'>Wachtwoord resetten</h1>" +
            "<p style='color:#919191; font-size:16px; margin-bottom:25px;'>Om uw wachtwoord te wijzigen, gelieve op de onderstaande link te klikken.</p>" +
            "<div style='text-align:center; padding:25px; background-color:#fafafa;'>" +
            "<p style='color:black; font-size:20px; margin-bottom:25px;'><a href='" + process.env.REACT_APP_CLIENT_URL + "/forgotpassword/" + ID + "' style='padding: 10px 25px;background-color: #7f3689;color: white;border-radius: 5px;text-decoration: none;'>Nieuw wachtwoord aanmaken</a></p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send({ EmailSent: true });
        }
    });
});

// send Email for event cancelation
app.post('/event-delete-email', (req, res) => {
    const { EventTitle, Emails } = req.body;

    const mailOptions = {
        from: process.env.USER,
        to: Emails,
        subject: "Evenement geannuleerd",
        html: "<html>" +
            "<body>" +
            "<div style='width:100%; height:100%; background-color:#f4f4f4; padding:30px;'>" +
            "<div style='width:600px; height: auto; margin:0 auto; padding:25px; border-radius:5px; background-color:white;'>" +
            "<h1 style='color:#7F3689;'>" + EventTitle + "</h1>" +
            "<p style='color:#919191; font-size:16px; margin-bottom:25px;'>Helaas is dit evenement geannuleerd. De omstandigheden hebben ertoe geleid dat we genoodzaakt zijn deze beslissing te nemen.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send({ EmailSent: true });
        }
    });
});

// Get Emails by ID
app.get('/get-email-by-id/:ID', (req, res) => {
    db.query(`SELECT Email FROM accounts WHERE ID = "${req.params.ID}"`, (error, result) => {
        if (error) console.log(error);

        if (result.length > 0) {
            res.status(200).send(result);
        }
        else {
            res.send(false);
        }
    });
});

// get every users
app.get('/users', (req, res) => {
    db.query("SELECT * FROM accounts", (error, result) => {
        res.send(result);
    });
})

// get users ID by email
app.get('/get-id-by-email/:Email', (req, res) => {
    db.query(`SELECT ID FROM accounts WHERE Email = "${req.params.Email}"`, (error, result) => {
        if (error) console.log(error);

        if (result.length > 0) {
            res.status(200).send(result);
        }
        else {
            res.send(false);
        }
    });
});

// reset password call
app.post('/resetpassword', (req, res) => {
    const { id, password } = req.body;

    db.query(`UPDATE accounts SET Password = "${password}" WHERE ID = "${id}"`, (error, result) => {
        if (error) console.log(error);

        if (result) {
            res.status(200).send({ status: 'success' });
        }
        else {
            res.send({ status: 'failed' });
        }
    });
});

// Update user details
app.post('/user_update', (req, res) => {
    const { ID, Email = req.session.user.Email, FirstName = req.session.user.FirstName, LastName = req.session.user.LastName, TFA = req.session.user.TFA } = req.body;

    db.query("UPDATE accounts SET Email=?, FirstName=?, LastName=?, TFA=? WHERE ID = ?",
        [Email, FirstName, LastName, TFA, ID],
        (error, result) => {
            if (error) {
                console.error(error);
                res.send(false);
            } else {
                if (result) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }
        });
});

//Update Session cookie
app.post("/session-update", (req, res) => {
    const { Email, FirstName, LastName, TFA } = req.body;

    if (req.session.user) {
        req.session.user = {
            ...req.session.user,
            Email: Email ?? req.session.user.Email,
            FirstName: FirstName ?? req.session.user.FirstName,
            LastName: LastName ?? req.session.user.LastName,
            TFA: TFA ?? req.session.user.TFA
        };

        // console.log(req.session.user);

        req.session.save();
        res.send(true);
    } else {
        res.send(false);
    }
})

// create user session
app.post('/session-create', (req, res) => {
    // console.log(req.body);
    req.session.user = {
        ID: req.body.ID,
        Email: req.body.Email,
        Password: req.body.Password,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Level: req.body.Level,
        TFA: req.body.TFA
    };

    res.send(true);
});

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
    db.query(`SELECT * FROM accounts WHERE Email = "${req.body.email}" AND Password = "${req.body.password}"`, (error, result) => {

        if (error) res.send(false);

        if (result.length > 0) {
            // Send JSON array back with data
            res.json({
                Login: true,
                ID: result[0].ID,
                Email: result[0].Email,
                Password: result[0].Password,
                FirstName: result[0].FirstName,
                LastName: result[0].LastName,
                Level: result[0].Level,
                TFA: result[0].TFA
            });
        }
        else {
            // console.log("Wrong username/password");
            res.json({ Login: false });
        }
    });
})

// Logout GET
app.get("/signout", (req, res) => {
    res.clearCookie("userID");
    res.send({ signedOut: true });
    res.end();
})

// Insert news article
app.post('/insert_news', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const imageFilename = req.file ? req.file.filename : 'standard.png';

    const sql = 'INSERT INTO news (title, description, image) VALUES (?, ?, ?)';
    db.query(sql, [title, description, imageFilename], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error inserting data' });
        } else {
            const sql = 'UPDATE accounts SET NotiCounter = NotiCounter + 1';
            db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error updating NotiCounter' });
                } else {
                    res.status(200).json({ message: 'News article inserted successfully and NotiCounter updated' });
                }
            });
        }
    });
});

// Edit news article by id
app.post('/edit_article/:id', (req, res) => {
    const articleId = req.params.id;
    const { title, description } = req.body;

    const sql = 'UPDATE news SET title = ?, description = ? WHERE id = ?';

    db.query(sql, [title, description, req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error editing article' });
        } else {
            res.status(200).json({ message: 'Article edit successfully' });
        }
    });
});

// Delete news article by id
app.post('/delete_article/:id', (req, res) => {
    const articleId = req.params.id;
    const sql = 'DELETE FROM news WHERE id = ?';

    db.query(sql, [articleId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error deleting article' });
        } else {
            res.status(200).json({ message: 'Article deleted successfully' });
        }
    });
});

// Get news article by id
app.get('/reset_noticounter/:ID', (req, res) => {
    const userId = req.params.ID;

    const sql = 'UPDATE accounts SET NotiCounter = 0 WHERE ID = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error resetting NotiCounter' });
        } else {
            res.status(200).json({ message: 'NotiCounter reset successfully' });
        }
    });
});

// Get notifications by id
app.get('/get_noticounter/:ID', (req, res) => {
    const userId = req.params.ID;

    const sql = 'SELECT NotiCounter FROM accounts WHERE ID = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error retrieving NotiCounter' });
        } else {
            res.status(200).send(results)
        }
    });
});

// Get news article by id
app.get('/get_article/:id', (req, res) => {
    const articleId = req.params.id;

    const sql = 'SELECT title, description FROM news WHERE id = ?';

    db.query(sql, [articleId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error retrieving article' });
        } else {
            res.status(200).send(results)
        }
    });
});

// Get all news articles
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

// add event
app.post('/insert_event', (req, res) => {
    const { title, date, time, summary, location, level, endJoinDate } = req.body;

    const sql = 'INSERT INTO events (Title, Date, Time, Description, Location, Level, EndJoinDate) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, date, time, summary, location, level, endJoinDate], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error inserting event data' });
        } else {
            res.status(200).json({ message: 'Event data inserted successfully', eventId: result.insertId });
        }
    });
});

// edit event by id
app.post('/edit_event/:id', (req, res) => {
    const { title, date, time, summary, location, level, endJoinDate } = req.body;
    const { id } = req.params;

    const sql = 'UPDATE events SET Title = ?, Date = ?, Time = ?, Description = ?, Location = ?, Level = ?, EndJoinDate = ? WHERE id = ?';
    db.query(sql, [title, date, time, summary, location, level, endJoinDate, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error updating event data' });
        } else {
            res.status(200).json({ message: 'Event data updated successfully' });
        }
    });
});

// delete event by id
app.post('/delete_event/:id', (req, res) => {
    const eventId = req.params.id;

    const sql1 = 'DELETE FROM events WHERE id = ?';
    const sql2 = 'DELETE FROM event_users WHERE event_id = ?';

    db.query(sql2, [eventId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error deleting event users' });

        } else {
            db.query(sql1, [eventId], (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error deleting event' });
                } else {
                    res.status(200).json({ message: 'Event and event users deleted successfully' });
                }
            });
        }
    });
});

// get every events
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

// get every events
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

// get event by date
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

// get users of event by id
app.get('/event_users/:ID', (request, response) => {
    db.query(`SELECT accounts.FirstName, accounts.Email, accounts.LastName FROM event_users LEFT JOIN accounts ON event_users.User_ID=accounts.ID WHERE Event_ID = "${request.params.ID}"`, (error, result) => {
        if (error) console.log(error);

        response.send(result);
    });
})

//get available users by the date
app.get('/users_day/:day', (request, response) => {
    const day = request.params.day;
    db.query('SELECT accounts.FirstName, accounts.LastName FROM Employee_Schedule LEFT JOIN accounts ON Employee_Schedule.Account_ID = accounts.ID WHERE ?? NOT LIKE ? OR NOT NULL', [day, 'Thuis'], (error, result) => {
        if (error) console.log(error);

        response.send(result);
    });
});

// get all the rooms status of the date
app.get('/rooms_status/:day', (request, response) => {
    db.query(`SELECT ${request.params.day} FROM Employee_Schedule`, (error, result) => {
        if (error) console.log(error);

        const werkRuimtes = result.map(entry => entry[request.params.day]);
        response.send(werkRuimtes);
    });
})

// join event
app.post('/joinevent', (req, res) => {
    const { EventId, UserId } = req.body;


    const sql = 'INSERT INTO event_users (Event_ID, User_ID) VALUES (?, ?)';
    db.query(sql, [EventId, UserId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error inserting event data' });
        } else {
            res.status(200).json({ message: 'Event data inserted successfully' });
        }
    });
});

// leave event
app.post('/leaveevent/:EventId/:UserId', (req, res) => {
    db.query(`DELETE FROM event_users WHERE Event_ID = "${req.params.EventId}" AND User_ID = "${req.params.UserId}"`, (error, result) => {
        if (error) console.log(error);

        res.send(result);
    });
});

// check if user is already in event
app.get('/checkevent/:EventId/:UserId', (req, res) => {
    db.query(`SELECT * FROM event_users WHERE Event_ID = "${req.params.EventId}" AND User_ID = "${req.params.UserId}"`, (error, result) => {
        if (error) console.log(error);

        if (result.length > 0) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    });
});

// check if the user has liked the event
app.get('/checkLike/:EventId/:UserId', (req, res) => {
    const { EventId, UserId } = req.params;

    const sql = `
        SELECT * FROM event_users
        WHERE Event_ID = ? AND User_ID = ? AND IsLiked = 1
    `;

    db.query(sql, [EventId, UserId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error checking like status' });
        } else {
            if (result.length > 0) {
                res.json({ hasLiked: true });
            } else {
                res.json({ hasLiked: false });
            }
        }
    });
});

// Like endpoint
app.post('/like_event/:EventId/:UserId', (req, res) => {
    const { EventId, UserId } = req.params;

    const sql = `
        UPDATE event_users
        SET IsLiked = NOT IsLiked
        WHERE Event_ID = ? AND User_ID = ?
    `;

    db.query(sql, [EventId, UserId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error toggling the like status of the event' });
        } else {
            res.status(200).json({ message: 'Event like status toggled successfully' });
        }
    });
});

// Unlike endpoint
app.post('/unlike/:EventId/:UserId', (req, res) => {
    const { EventId, UserId } = req.params;

    const sql = `
        UPDATE event_users
        SET IsLiked = FALSE
        WHERE Event_ID = ? AND User_ID = ?
    `;

    db.query(sql, [EventId, UserId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error unliking the event' });
        } else {
            res.status(200).json({ message: 'Event unliked successfully' });
        }
    });
});

// get all the count of the likes of the event
app.get('/countLikes/:EventId', (req, res) => {
    const { EventId } = req.params;

    const sql = `
        SELECT COUNT(*) as likes
        FROM event_users
        WHERE Event_ID = ? AND IsLiked = true
    `;

    db.query(sql, [EventId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error counting likes' });
        } else {
            res.status(200).json({ likes: result[0].likes });
        }
    });
});

// get check if the event has a end join date
app.get('/eventsregistertime/:EventId', (req, res) => {
    db.query(`SELECT * FROM events WHERE ID = "${req.params.EventId}" AND EndJoinDate < CURRENT_DATE()`, (error, result) => {
        if (error) console.log(error);

        if (result.length > 0) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    });
});

// insert users week availablity
app.post('/scheduleweek', (req, res) => {
    db.query(`  INSERT INTO caverogroep2.Employee_Schedule (Account_ID, Monday, Tuesday, Wednesday, Thursday, Friday)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    Monday = ?,
                    Tuesday = ?,
                    Wednesday = ?,
                    Thursday = ?,
                    Friday = ?;`,
        [req.body.Account_ID, req.body.Monday, req.body.Tuesday, req.body.Wednesday, req.body.Thursday, req.body.Friday,
        req.body.Monday, req.body.Tuesday, req.body.Wednesday, req.body.Thursday, req.body.Friday],
        (error) => {
            if (error) console.log(error);

            res.send(true);
        });
});

// get users week availablity
app.get('/get-employee-schedule/:Account_ID', (req, res) => {
    db.query(`SELECT * FROM Employee_Schedule WHERE Account_ID = ${req.params.Account_ID}`, (error, result) => {
        if (error) console.log(error);

        if (result.length > 0) {
            res.send(result);
        } else {
            res.send(null);
        }
    });
});

// insert new user
app.post('/register', (req, res) => {
    const { email, password, firstname, lastname, level } = req.body;

    db.query("SELECT * FROM accounts WHERE Email = ?", [email], (error, result) => {
        if (error) {
            console.log(error);
            res.send({ error: "Error" });
        }

        if (result.length > 0) {
            res.send({ error: "Email already exists" });
        } else {
            db.query("INSERT INTO accounts (Email, Password, FirstName, LastName, Level) VALUES (?, ?, ?, ?, ?)",
                [email, password, firstname, lastname, level],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        res.send({ error: "Error" });
                    } else {
                        res.send({ message: "User registered" });
                    }
                });
        }
    });
}
);

function generateUniqueFilename(originalFilename) {
    const extension = path.extname(originalFilename);
    const uniqueFilename = `${uuid.v4()}${extension}`;
    return uniqueFilename;
}

app.listen(8080, () => {
    console.log("Server listening");
});