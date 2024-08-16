
/*const mongodb = require('mongodb');
// JWT used for authentification
const jwt = require("jsonwebtoken");
// secret JWT key
const jwtSecret = "jwtSecret1234567890";
var ObjectId = mongodb.ObjectId
module.exports = async function (request, result, next) {
    try {
        const accessToken = request.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(accessToken, jwtSecret);
        const userId = decoded.userId;
        
        const user = await db.collection("users").findOne({
            accessToken: accessToken
        });
        
        if (user == null) {
            result.status(401).json({
                status: "error",
                message: "User has been logged outNull."
            });
            return;
        }

        delete user.password;
        delete user.accessToken;
        delete user.createdAt;

        request.user = user;
        next();


    } catch (exp) {
        console.log("Error");
        result.status(401).json({
            status: "error",
            message: "User has been logged outCatch."
        });
    }
};*/

const jwt = require("jsonwebtoken");
const jwtSecret = "jwtSecret1234567890"; // Il est recommandé de stocker ce secret de manière sécurisée
const mongodb = require('mongodb');

module.exports = async function (request, response, next) {
    try {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Authorization header missing or invalid');
        }
        const accessToken = authorizationHeader.split(" ")[1];
        const decoded = jwt.verify(accessToken, jwtSecret);
        const userId = decoded.userId;

        // Remplacez `db` par votre instance de connexion MongoDB
        const user = await db.collection("users").findOne({
            accessToken: accessToken
        });

        if (!user) {
            return response.status(401).json({
                status: "error",
                message: "User has been logged out"
            });
        }

        delete user.password;
        delete user.accessToken;
        delete user.createdAt;

        request.user = user;
        next();
    } catch (error) {
        console.error(error);
        return response.status(401).json({
            status: "error",
            message: "User has been logged out"
        });
    }
};

