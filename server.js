const express = require("express");
const app = express();
const http = require("http").createServer(app);
//const mongodb = require('mongodb');
const { MongoClient, ObjectId, Db } = require("mongodb");
//var MongoClient = mongodb.MongoClient;

//var ObjectId = mongodb.ObjectId;

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    //Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    // Set to true if you need the websit to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données de formulaire
//app.use(express.json()); // Middleware pour parser les corps de requête JSON
// module required for parsing FormData values
const expressFormidable = require("express-formidable");
// setting the middlware
app.use(expressFormidable());
// module required for encrypting the passwords
// and verify the password as well
const bcrypt = require("bcrypt");

// JWT used for authentification
const jwt = require("jsonwebtoken");
const auth = require("./modules/auth");
const chat = require("./modules/chat");
const contact = require("./modules/contact");
// secret JWT key
const jwtSecret = "jwtSecret1234567890";

// sockets are used for realtime communication
const socketIO = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// array that holds all connected users socket ID
global.users = [];


http.listen(3000, function () {
    console.log("Server has been started at port 3000");
});
(async ()=> {
    try {
        let client = await MongoClient.connect("mongodb://localhost:27017/");
          //  var db = new Db(client, "mevn");
            const db = client.db("mevn")
             global.db = db;
            console.log("Connexion reussi avec la BD ");

            socketIO.on("connection", function (socket) {
                socket.on("connected", function (email) {
                    users[email] = socket.id;
                    console.log(users);
                });
            });
            // view all contact
            

            // Add contact
            contact.init(app, express);
            chat.init(app, express);
            chat.socketIO = socketIO;

            // route for logout request

            app.post("/logout", auth, async function (request, result) {
                const user = request.user;

                // update JWT of user in database
                await db.collection("users").findOneAndUpdate({
                    "_id": user._id
                }, {
                    $set: {
                        "accessToken": ""
                    }
                });
                result.json({
                    status: "success",
                    message: "logout successfully"
                });
            });

            app.post("/getUser", auth, async function (request, result) {
                const user = request.user;

                result.json({
                    status: "success",
                    message: "Data has been fetched.",
                    user: user
                });
            }); 
            // route for login requests


            app.post("/login", async function (request, result) {
                // get values from login form
                const email = request.fields.email;
                const password = request.fields.password;

                // check if email exists
                const user = await db.collection("users").findOne(
                    {
                        "email": email
                    }
                );
                if (user == null) {
                    result.json({
                        status: "error",
                        message: "Email does not exists."
                    });
                    return;
                }

                // check if password 

                bcrypt.compare(password, user.password, async function (error, isVerify) {
                    if (isVerify) {
                        // generate JWT of user
                        const accessToken = jwt.sign({
                            "userId": user._id.toString()
                        }, jwtSecret);

                        // update JWT of user in database
                        await db.collection("users").
                        findOneAndUpdate({
                            "email": email
                        }, {
                            $set: {
                                "accessToken": accessToken
                            }
                        });

                        result.json({
                            status: "success",
                            message: "Login successfully.",
                            accessToken: accessToken
                        });

                        return;
                    }

                    result.json({
                        status: "error",
                        message: "Password is not correct."
                    });
                });
            });


            app.post("/registration", async function (request, result) {
               const name = request.fields.name;
               const email = request.fields.email;
               const password = request.fields.password;
               const createdAt = new Date().getTime();
       
               if (!name || !email || !password) {
                   result.json({
                       status: "error",
                       message: "Please enter all values."
                   });
                   return;
               }
               // check if email already exists
               var user = await db.collection("users").findOne({
                   email: email
               });
       
                if (user != null) {
                   result.json({
                       status: "error",
                       message: "Email already exists."
                   });
                   return;
               }
       
               //encrypt the password
       
               bcrypt.hash(password, 10, async function (error, hash) {
                   //insert in database
                   await db.collection("users").insertOne({
                       name: name,
                       email: email,
                       password: hash,
                       accessToken: "",
                       contacts: [],
                       createdAt: createdAt
                   });
                   result.status(200).json({
                       status: "success",
                       message: "User has been signed up."
                   });
               });
            });
    } catch (error) {
        console.error(error);
        return;
    }
})();


