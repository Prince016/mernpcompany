const jwt = require("jsonwebtoken")
const User = require("../modal/userSchema");

const Authenticate = async (req, res, next) => {

    try {

        const token = req.cookies.jwttoken;
        //  now verify the token - becoz of this  token we get  users detail we fetch 
        //  and try to  verify the user is valid or not  
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        //  verifytoekn_id , "tokens:tokens" ( comming from the database ) ,  token( is current token by the user )
        // now rootuser has all the detials of user 
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            console.log("user is Not found in the database ");
            throw new Error(" User not found ")
        }

        req.token = token;
        req.rootUser = rootUser;
        // get the user id from teh database 
        req.userID = rootUser._id;

        next();

    } catch (err) {
        res.status(401).send(" Unauthorized: No token provided yet  ")
        console.log(err);
    }
}

module.exports = Authenticate;