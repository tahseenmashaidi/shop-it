const User = require('../models/user');
const ErrorHandler=require('../utils/errorHandler');
const catchAsyncErrors= require('../middlerwares/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

//Register a user=> /api/v1/register
exports.registerUser=catchAsyncErrors(async (req,res,next) => {
    const {name,email,password} = req.body;
    const user =await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'samples/imagecon-group' ,
            url:'https://res.cloudinary.com/cloudinaryapi13936/image/upload/v1614008443/samples/imagecon-group.jpg'
        }
    })
    sendToken(user,200,res)
})

//Login a user=> /api/v1/login
exports.loginUser=catchAsyncErrors(async (req,res,next)=>{
    const {email,password}=req.body

//    check if email and password is entered by user
    if (!email||!password){
        return next(new ErrorHandler('Please enter email & password',400))
    }
//    finding user in database
    const user = await User.findOne({email}).select('+password');
    if (!user){
        return next(new ErrorHandler('Invalid Email or Password',401))
    }
//    Check if password is corrector not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or Password',401))
    }
    sendToken(user,200,res)
})
// Forget Password =>/api/v1/password/forget
exports.forgetPassword=catchAsyncErrors(async (req,res,next)=>{
    const user=await  User.findOne({email:req.body.email});
    if (!user){
        return next(new ErrorHandler("User not found with this email",404))
    }
//    Get reset token
    const resetToken=user.getResetPasswordToken();
    await  user.save({validateBeforeSave:false})

//    Create reset password url
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message=`Your password reset token is as follow:\n\n${resetToken}\n\nIf you have not request this email,then ignore it.`

    try {
        await  sendEmail({
            email:user.email,
            subject:"ShopIT Password Recovery",
            message
        })
        res.status(200).json({
            success:true,
            message:`Email send to ${user.eamil}`
        })
    }catch (err) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await  user.save({validateBeforeSave:false})

        return  next(new ErrorHandler(err.message,500))
    }
})

//Logout user=>/api/v1/logout
exports.logoutUser=catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})
