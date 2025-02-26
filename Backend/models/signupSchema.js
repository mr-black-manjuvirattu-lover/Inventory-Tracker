const mdb =require("mongoose")

const SignupSchema =mdb.Schema({
    Name:String,
    Email:String,
    Password:String,
    PhoneNumber:Number
})

const signup_schema=mdb.model("signup",SignupSchema)

module.exports= signup_schema;