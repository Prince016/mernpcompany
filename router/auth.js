const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../modal/userSchema");

const { response } = require("express");

router.get("/", (req, res) => {
    res.send("hellow from the router js");
});

//  ------------  Using the Promises

// router.post('/register', (req, res) => {
//     // --------     by object destructreing and it have to same to database variables
//     const { name, email, phone, work, password, cpassword } = req.body;
//     console.log(name);
//     console.log(email);

//     // -------   old ways   -------------
//     // console.log(req.body);
//     // console.log(req.body.name);
//     // console.log(req.body.email);
//     // res.json({ message: req.body });

//     // ------------------ Validation at backend
//     if (!name || !email || !phone || !work || !password || !cpassword) {

//         //  ----- -client error -422
//         return res.status(422).json({ error: "plx filled the field propertly " })
//     }

//     //  ---------------  database : user filling email perform  matching
//     User.findOne({ email: email })
//         .then((userExit) => {
//             if (userExit) {
//                 return res.status(422).json({ error: "Email Already exits  " })

//             }

//             // -------- saving the user deatil to the databse OR
//             //---------  creatign the new document /instance
//             const user = new User({ name, email, phone, work, password, cpassword });

//             user.save().then(() => {
//                 res.status(201).json({ message: "user registered successfully " });
//             }).catch((err) => {
//                 //  ------  database error - 500
//                 res.status(500).json({ error: " failed to registered " })
//             });
//         }).catch(err => { console.log(err); });
// });

//  ------------------ Using the Asyn and await ------------------------------------------
// ------------------  Registering the users -----------------------------------------------------

router.post("/register", async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    console.log(req.body);

    // ------------------ Validation at backend
    if (!name || !email || !phone || !work || !password || !cpassword) {
        //  ----- -client error -422
        return res.status(422).json({ error: "plx filled the field propertly " });
    }

    try {
        const userExit = await User.findOne({ email: email });

        if (userExit) {
            return res.status(422).json({ error: "Email Already exits  " });
        } else if (password != cpassword) {
            return res.status(422).json({ error: " Password are  not matching   " });
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });

            //  yaha pe password hash karna hai

            await user.save();

            res.status(201).json({ message: "user registered successfully " });
        }
    } catch (err) {
        console.log(err);
    }
});

// -----------------------------     testing teh register   -------------------------------------------

// router.post("/register", async (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;
//     console.log(req.body);

//     // ------------------ Validation at backend
//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         //  ----- -client error -422
//         return res.status(422).json({ error: "plx filled the field propertly " });
//     }

//     try {
//         const userExit = await User.findOne({ email: email });

//         if (userExit) {
//             return res.status(422).json({ error: "Email Already exits  " });
//         }

//         const user = new User({ name, email, phone, work, password, cpassword });

//         //  yaha pe password hash karna hai

//         await user.save();

//         res.status(201).json({ message: "user registered successfully " });
//     } catch (err) {
//         console.log(err);
//     }
// });

// --------------------------- Login the users ----------------------------------------------------------

router.post("/signin", async (req, res) => {
    // console.log(req.body);
    try {
        let token;

        const { email, password } = req.body;
        // res.json({ message: "awesome " });

        if (!email || !password) {
            return res.status(400).json({ error: "filled the data carefully " });
        }
        //  database (): uservala email

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);

        //  (database (vala pass), user filling pass)

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            // (key "cookie name ", value(Token (what you have to store in the cookie )))
            res.cookie("jwttoken", token, {
                //  aaj se to  30 days tak yeh token valid hai
                expires: new Date(Date.now() + 25892000000),
                // store in http
                httpOnly: true,
            });

            if (!isMatch) {
                res.status(400).json({ err: " Invalid credientials By users  " });
            } else {
                console.log("user successfully login ");
                res.json({ messge: "user login successfully " });
            }
        } else {
            res.status(400).json({ messge: "Invalid credientials  " });
        }
    } catch (error) {
        console.log(error);
    }
});

// -----------------------------     testing teh login   ---------------------------

// router.post("/signin", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ error: "filled the data carefully " });
//         }

//         const userLogin = await User.findOne({ email: email });

//         res.json({ message: "user signin Sucessfully " });
//     } catch (error) {
//         console.log(error);
//     }
// });

//  ---------------------------  Authenicate the routes before the login -------------------

router.get("/about", authenticate, (req, res) => {
    console.log(`hello from the About `);
    res.send(req.rootUser);
});

// ----------------------------      get user data for contact and home page  ----------------
router.get("/getdata", authenticate, (req, res) => {
    console.log(`hello from the About `);
    res.send(req.rootUser);
});


// ------------------------------------------     contact us page -------------------------------

router.post("/contact", authenticate, async (req, res) => {


    try {
        // simply means name = req.body.name
        const { name, email, phone, message } = req.body

        if (!name || !email || !phone || !message) {
            console.log("plz fill the all the fields ")
            return res.json({ error: "plz. filled the contact form " })
        }

        // -----    To find the user  in the  database   -------------------- 
        //-------------  | _id(left in the database) : kjiojweorjfjsd (right side in  that is in database )
        const UserContact = await User.findOne({ _id: req.userID });

        if (UserContact) {
            // adding the name,emai,mess in the database just like token  
            const userMessage = await UserContact.addMessage(name, email, phone, message);

            await UserContact.save();

            res.status(201).json({ message: "user message/contact form save successfully" })
        }

    } catch (err) {
        console.log(err);
    }

});



// ---------------------------    Logout -------------------------------
router.get("/logout", (req, res) => {
    console.log(`hello from the logout page  `);
    res.clearCookie('jwttoken', { path: '/' });
    res.status(200).send("User Logout ");
});




module.exports = router;
