const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    zip: {
        type: String,
        required: true
    },
    dailcode: {
        type: Number,
        required: true,
        
    },
    
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    height: {
        type: Number,
        required: true
        
    },
    weight: {
        type: Number,
        required: true
    },
    tokens_db: [{
        token:{
            type: String,
           required: true
        }
    }]

})

// JWT authentication

userSchema.methods.generateAuthToken = async function (){
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString()}, process.env.SECRET_KEY) 
        console.log(token)
        this.tokens_db = this.tokens_db.concat({token:token})
        await this.save();
        return token;
    } catch (e) {
        console.log("the error part "+e)
    }
}

// Hashing passssssssssssssssss

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})

//now create connection

const Register = new mongoose.model("Registration", userSchema);

module.exports = Register;