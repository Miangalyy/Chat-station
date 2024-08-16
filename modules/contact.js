/*const auth = require("./auth");
const mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;
module.exports = {
    init: function (app, express) {
        const router = express.Router();

        router.post("/save", auth, async function (request, result) {
            const name = request.fields.name;
            const email = request.fields.email;
            const user = request.user;

            const contactUser = await db.collection("users").findOne({
                email: email
            });

            if (contactUser == null) {
                result.json({
                    status: "error",
                    message: "User Not found"
                });
                return;
            }

            const UserContact = await db.collection("users").findOne({
                $and: [{
                    _id: user._id
                }, {
                    "contacts._id": contactUser._id
                }]
            });

            if (UserContact != null) {
                result.json({
                    status: "error",
                    message: "Contact already exists."
                });
                return;
               } 

            await db.collection("users").findOneAndUpdate({
                _id: user._id
            }, {
                $push: {
                    contacts: {
                        _id: contactUser._id,
                        name: name,
                        email: email,
                        unreadMessages: 0
                    }
                }
            });
            
            result.json({
                status: "success",
                message: "Contact has been saved."
            });
        });

        app.use("/contact", router);
    }
}; */

const auth = require("./auth");
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

module.exports = {
    init: function (app, express) {
        const router = express.Router();

        // Delete contact

        router.post("/delete", auth, async function (request, result) {

            try {
                const email = request.fields.email;
                const user = request.user;
    
                const contactUser = await db.collection("users").findOne({
                    $and: [{
                        _id: user._id
                    }, {
                        "contacts.email": email
                    }]
                });
    
                if (contactUser == null) {
                    result.json({
                        status: "error",
                        message: "User not found"
                    });
                    return;
                }
    
                await db.collection("user").findOneAndUpdate({
                    _id: user._id
                }, {
                    $pull: {
                        "contacts": {
                            "email": email
                        }
                    }
                });
    
                result.json({
                    status: "success",
                    message: "contact has been deleted."
                });
            } catch (error) {

                result.json({
                    status: "error",
                    message: error
                });
            }
        });

        // view all contact
        router.post("/fetch", auth, async function (request, result) {
            const user = request.user;
            try {
                result.json({
                    status: "success",
                    message: "Contacts has been fetched",
                    contacts: user.contacts
                });
            } catch (error) {
                console.error(error);
                return response.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
            }

        });

        router.post("/save", auth, async function (request, response) {
            try {
                const { name, email } = request.fields; // Utiliser request.fields au lieu de request.body
                
                const user = request.user;

                const contactUser = await db.collection("users").findOne({ email });

                if (!contactUser) {
                    return response.json({
                        status: "error",
                        message: "User Not found"
                    });
                }

                const userContact = await db.collection("users").findOne({
                    _id: user._id,
                    "contacts._id": contactUser._id
                });

                if (userContact) {
                    return response.json({
                        status: "error",
                        message: "Contact already exists."
                    });
                }

                await db.collection("users").updateOne(
                    { _id: user._id },
                    {
                        $push: {
                            contacts: {
                                _id: contactUser._id,
                                name: name,
                                email: email,
                                unreadMessages: 0
                            }
                        }
                    }
                );

                return response.json({
                    status: "success",
                    message: "Contact has been saved."
                });
            } catch (error) {
                console.error(error);
                return response.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                });
            }
        });

        app.use("/contact", router);
    }
};
