const mongooose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchemna = new mongooose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }

    ],

    tokens: [{

        token: {
            type: String,
            required: true
        }
    }]
});



// save method ke upper use karna hai 
//  function (req,res,next)
userSchemna.pre('save', async function (next) {
    console.log("hashing the password ");
    if (this.isModified('password')) {
        // console.log("inside the prepassword ");
        const hash = await bcrypt.hash(this.password, 12);
        const chash = await bcrypt.hash(this.cpassword, 12);

        this.password = hash;
        this.cpassword = chash;
        console.log(hash);
    }
    next();
});




//  we generating the token 
userSchemna.methods.generateAuthToken = async function () {
    try {
        //  to generate a token we use sign and to verify the token we use isverfied() 
        //   (payload(_id,this._id ) , scret key )
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        // ({ token(database) : token(New Generating token means above line vala token  )   })  
        //  we are using this to save the new token in the database 
        this.tokens = this.tokens.concat({ token: token })

        await this.save()

        return token;

    } catch (error) {
        console.log(error);
    }
}


// accepting the parameter becoz we send the arguments 
userSchemna.methods.addMessage = async function (name, email, phone, message) {

    try {

        // if both key and value are same then we don't need to write like ({ name : namevalue(parameter vala )  })
        this.messages = this.messages.concat({ name, email, phone, message });

        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error);
    }

}


//Collections creation
const User = mongooose.model('USER', userSchemna);

module.exports = User;