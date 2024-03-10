const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const todoHandler = require('./routeHandler/todohandler');
const userHandler = require('./routeHandler/userhandler');
const app = express();
app.use(express.json())


//database connectionn with mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jz0ivtr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
 .then(() => console.log('connection successful'))
 .catch((err) => console.log(err))


//application routes
app.use('/todo', todoHandler)
app.use('/user', userHandler)

//default error handlers

function errorHandler(err, req, res, next){
    if(resizeBy.headersSent){
        return next(err)
    }
    
    res.status(500).json({error: err});
}

app.listen(3000, ()=>{
    console.log('app listening on port 3000')
})