const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router()
const userSchema = require('../schemas/userSchemas')
const User = new mongoose.model('User', userSchema)
console.log('user model -> ',User)


//Sign up
router.post('/signup', async (req, res) => {
    const {name, userName, password} = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    console.log('hashing password -> ', hashPassword)
    const newUser = new User({name,userName,password: hashPassword});
    console.log('new user -> ',newUser)
    
    try{
        await newUser.save()
        res.status(201).send('successfully sign up')
    }
    catch(err){
        res.status(500).send('sign up failed')
    }
})

//Login 
router.post('/login', async(req, res) =>{
    try{
        const user = await User.find({userName: req.body.userName})
        console.log('user -> ',user)
        if(user && user.length > 0){
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password)
            console.log('valid password -> ', isValidPassword)
            if(isValidPassword){
                //generate token
                console.log('token -> ',process.env.JWT_SECRET)
                const token = jwt.sign({
                    userName: user[0].userName,
                    userId: user[0]._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })
                res.status(200).json({
                    'access_token': token,
                    'message':'successfully login ... '
                })
            }
            else{
                res.status(401).send('Authentication failed')
            }
        }
        else{
            res.status(401).send("Authentication failed")
        }
    }
    catch{
        res.status(401).send("Authentication failed")
    }
})

//get all users
router.get('/all', async(req, res) => {
    try{
        const users = await User.find().populate('todos')
        res.status(200).json({
            result: users,
            message: 'Successfull'
        })
    }
    catch(err){
        res.status(500).json({
            error: "There was an error on server side"
        })
    }
})

module.exports = router;