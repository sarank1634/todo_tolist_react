const mongoose  = require('mongoose')


const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

const TodoModel = mongoose.model('todos', TodoSchema)
module.exports = TodoModel;