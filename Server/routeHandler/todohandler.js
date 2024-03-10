const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchemas')
const Todo = new mongoose.model('Todo', todoSchema)
const userSchema = require('../schemas/userSchemas');
const User = new mongoose.model("User", userSchema)
console.log('above todo -> ',Todo)
const checkLogin = require('../middelwares/checkLogin')

//Get all the todos
router.get('/', checkLogin, async(req, res) =>{
    const result = await Todo.find().populate("user", 'name userName -_id')
    res.send(result)
})

//get active todo with async and await. this findActive method create custom in todSchemas
router.get('/active', async(req, res) =>{
    console.log('clicked active route')
    const todo = new Todo()
    try{
        const data = await todo.findActive()
        res.status(200).send(data)
    }
    catch(err){
        res.status(500).send(err)
    }
})


//get js from title property of Todo
router.get('/js', async(req, res) => {
    const data = await Todo.findByJS();
    res.status(200).json({
        data
    })
})

//get js from title property of Todo
router.get('/language', async(req, res) => {
    const data = await Todo.find().byLanguage('js');
    res.status(200).json({
        data
    })
})

//Get a todo by id
router.get('/:id', async(req, res) =>{
    res.send('specific id todo')
})

//Post todo
router.post('/', checkLogin, async (req, res) =>{
    console.log(req.body)
    const newTodo = new Todo({
        ...req.body,
        user: req.userId
    });
    console.log('new to do -> ',newTodo)
    
    try {
        //instance method
        const todo = await newTodo.save();
        console.log("user id -> ", req.userId)
        console.log('todo id -> ', todo._id)
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: todo._id
            }
        })
        res.status(201).json({
            message: "Todo was  inserted successfully..."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'There was a server side error'
        })
    }

})

//Post multiple todo
router.post('/all', async(req, res) =>{
    console.log('all data -> ', req.body)
    try{
        await Todo.insertMany(req.body)
        res.status(200).json({
            message: "Todos were inserted successfully"
        });
    }
    catch{
        res.status(200).json({
            error: 'Todos were inserted successfully'
        })
    }
    
})



//Put todo
router.put('/:id', async(req, res) =>{
    try{
        await Todo.updateOne({_id: req.params.id}, {
            $set: {
                status: 'active'
            }
        })
        res.status(200).json({
            message: "Todo was  updated successfully"
        });

    }
    catch{
        res.status(500).json({
            error: 'There was a server side error'
        })
    }
})

//Delete todo
router.delete('/:id', async(req, res) => {
    try{
        const result = await Todo.deleteOne({_id: req.params.id});
        res.send(result)
    }
    catch(err){
        res.status(500).json({
            error: 'There was a server side error'
        })
    }
})

module.exports = router