const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');


// var cors = require('cors')

// app.use(cors())


app.use(cookieParser());

dotenv.config({ path: './config.env' })
require('./db/conn')
// const User = require('./modal/userSchema');



app.use(express.json())


// we link the router files to make our route easy
app.use(require('./router/auth'));


const DB = process.env.DATABASE;
const PORT = process.env.PORT || 5000;


// MiddleWare

// const middleware = (req, res, next) => {
//     console.log(`hello from teh middle ware `);
//     next();
// }


app.get('/', (req, res) => {
    res.send(`Hello from the server`)

})

// console.log(process.env.SECRET_KEY);

// app.get('/about', middleware, (req, res) => {
//     res.send(`Hello about from the server`)

// })


// app.get('/contact', (req, res) => {
//     //-------------------    basic example to store cookies 
//     // res.cookie("testcookie", "value is prashant")
//     res.send(`Hello contact from the server`)

// })


app.get('/signin', (req, res) => {
    res.send(`Hello singin from the server`)

})



app.get('/signup', (req, res) => {
    res.send(`Hello singup from the server`)

})

// 3 . step for the heroku 

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
}



app.listen(PORT, () => {
    console.log(`server is running at port  ${PORT}`);
})