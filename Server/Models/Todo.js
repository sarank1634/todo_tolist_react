const mongoose  = require('mongoose')


const TodoScchema = new mongoose.Schema({
    task: String,
    done: {
        type: Boolean,
        
})

const TodoModel = mongoose.model('todos', TodoScchema)
module.exports = TodoModel;