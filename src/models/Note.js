const  mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    date: { 
        type: Date,
        default: Date.now,
    },
    user:{ 
        type: String
    }
})

const Note = mongoose.model('Note',NoteSchema);

module.exports = Note;