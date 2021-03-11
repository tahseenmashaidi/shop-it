const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type: 'string',
        required: [true,'Please enter your name'],
        maxLength:[40,'Your name cannot exceed 40 characters']
    },
    email:{
        type:String,
        required: [true,'Please enter your email address'],
        unique: true,
        validator:[validator.isEmail,'Please enter a valid email address'],
    },
    password:{
        type:String,
        required: [true,'Please enter your password'],
        minlength:[6,'Your password must be at least 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required: true
        }
    },
    roles:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encrypting password before saving user data

userSchema.pre('save',async  function (next){
    if (!this.isModified('password')){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})
// return JWT token
userSchema.methods.getJwtToken=function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}
//compare password
userSchema.methods.comparePassword=async function (enterPassword){
    return await  bcrypt.compare(enterPassword,this.password)
}
//Generate password reset token
userSchema.methods.getResetPasswordToken=function (){
//    Generate token
    const resetToken=crypto.randomBytes(20).toString('hex');

//    Hash and st to resetPasswordToken
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')

//    set token expire time
    this.resetPasswordExpire=Date.now()+30*60*1000;

    return resetToken
}


module.exports =mongoose.model('User',userSchema)
