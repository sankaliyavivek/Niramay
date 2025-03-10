const mongooes = require('mongoose')

const UserSchema = mongooes.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongooes.model('User', UserSchema)