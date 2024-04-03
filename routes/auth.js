const express = require('express');
const User =require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser =require ('../middleware/fetchUser')

const JWT_SECRET= 'NjG';

// Route:1 - Create a user using: POST "/api/auth/createuser".. Doesn't require login
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be at least 5 characters').isLength({min:5})
],async(req,res)=>{ 
    let success =false;
    // if there are bad request  then return errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success,errors:errors.array()});
        
    }
    try {
        const salt= await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt)
    
        // Create user
        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass,
        });
        const data ={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authToken})
        
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }

})

// Route:2 - Authenticate a user using: POST "/api/auth/login"..  require login

router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password can not be blank').exists(),
],async(req,res)=>{
    let success=false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }
    const {email,password}=req.body;
    const user = await User.findOne({email});
    try {
        if(!user){
            return res.status(404).json({error:"Please try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false
            return res.status(404).json({success,error:"Please try to login with correct credentials"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authToken})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }
})
//Route3:Get loggedin user Details using: POST "/api/auth/getuser" .login required

router.post('/getuser',fetchuser,async(req,res)=>{ 
    try {
        userId=req.user.id;
        console.log(`User ID: ${userId}`); // Log the user ID to verify it's being set
        const user=await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
        }
    })

module.exports= router