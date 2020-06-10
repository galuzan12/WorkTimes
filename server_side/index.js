const express = require('express');
const firebase = require('firebase');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
const { firebaseConfig } = require('./Config');
const saltRounds = 10;
app.use(cors());


firebase.initializeApp(firebaseConfig());


const checkUsers = async (body, users) => {
    const { user, password } = body;
 
    let userToReturn = null;
    for (let u in users) {
        userToReturn = await bcrypt.compare(password, users[u].password).then(function (result) {
            if (result && user === users[u].user) {
                return userToReturn = {
                    user: users[u].user,
                    id: u
                };
            }
        });
    }
    console.log(userToReturn);

    return userToReturn || null;
}

app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json());

app.get('/', (req, res) => { // GET THE DATA FROM DB
    const { id } = req.query;
    try {
        firebase.database().ref(`USERS/${id}`).on('value', data => {
            const userToReturn = data.val();
            if (userToReturn === null) flag = true;
            firebase.database().ref(`TIMES/${id}`).on('value', data => {
                const times = data.val();
                // times === null ? res.status(500).json({ result: false }) : res.status(200).json(times);
                res.status(200).json(times);

            });
        });
    }
    catch (err) {
        res.status(500).json({ result: false })
    }
});

app.post('/login', (req, res) => { // LOGIN USER
    firebase.database().ref('USERS/').on('value', data => {
        const users = data.val();
        checkUsers(req.body, users).then(userToReturn => {
            userToReturn === null ? res.status(400).send({ result: false }) : res.status(200).send(userToReturn);
        })
    });
});

app.post('/postData', (req, res) => { // POST THE DATA TO DB
    const { id, rows } = req.body;
    console.log(id);
    let errorFlag = false;
    firebase.database().ref(`USERS/${id}`).on('value', data => {
        const user = data.val();
        if (user === null) {
            return res.status(500).send("not successful");;
        }
        firebase.database().ref(`TIMES/${id}/`).set({
            times: rows
        }).then(() => {
            // if (result) return;
            console.log("aaaassssssssssssssssssss");

            return res.status(200).send("successful");
        }).catch(err => {
            console.log("Aaaaaaaaaaaaaaaa");

            if (errorFlag) res.status(500).send("not successful");
        })
    });
});

app.post('/createUser', (req, res) => { // CREATE NEW USER
    const { user, password } = req.body;
    const uuid = uuidv4();
    bcrypt.hash(password, saltRounds).then((hash) => {
        // Store hash in your password DB.
        firebase.database().ref(`USERS/${uuid}`).set({
            user,
            password: hash
        }).then(() => {
            res.status(200).send({ id: uuid, user });
        }).catch(err => {
            res.status(500).send("not successful");
        })
    });
});

app.listen(PORT, () => console.log(`app listening at PORT: ${PORT}`));