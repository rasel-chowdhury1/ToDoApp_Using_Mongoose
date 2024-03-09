const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchemas')
const Todo = new mongoose.model('Todo', todoSchema)
console.log(Todo)

//Get all the todos
router.get('/', async(req, res) =>{
    const result = await Todo.find({status: 'active'})
    res.send(result)
})

//Get a todo by id
router.get('/:id', async(req, res) =>{
    res.send('specific id todo')
})

//Post todo
router.post('/', async (req, res) =>{
    console.log(req.body)
    const newTodo = new Todo(req.body);
    console.log('new to do -> ',newTodo)
    
    try {
        await newTodo.save();
        res.status(201).json({
            message: "Todo was  inserted successfully"
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
    const result = await Todo.deleteOne({_id: req.params.id});
    res.send(result)
})

module.exports = router