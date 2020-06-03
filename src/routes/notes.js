const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

router.get('/notes/add',(req,res)=>{
    res.render('notes/new-note');
})

router.post('/notes/new-note',async(req,res)=>{
    const { title, description } = req.body;
    
    const errors = []
    if(!title){
        errors.push({text: "Ingrese un titulo"});
    }
    if(!description){
        errors.push({text: "Ingrese una descripcion"});
    }
    if(errors.length>0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        });
    }else{
        const newNote = new Note({title,description})
        await  newNote.save();
        req.flash('success_msg','Note Added Successfully');
        res.redirect('/notes');
    }
})

router.get('/notes', async (req,res)=>{
    await Note.find()
    .then( doc =>{
        const body = {
            nota: doc.map(data => {
                return{
                title: data.title,
                description: data.description,
                _id: data._id
            }}),
        }        
        res.render('notes/all-notes', {notes: body.nota});
    })    
})

router.get('/notes/edit/:id', async (req,res)=>{
    await Note.findById(req.params.id)
    .then( doc =>{
        const body = {
            title: doc.title,
            description: doc.description,
            _id: doc._id
        }
        //console.log(body);
        res.render('notes/edit-note', { body });
    })  
})

router.put('/notes/edit-note/:id', async (req,res)=>{
    const {title}  = req.body;   

    await Note.findByIdAndUpdate(req.params.id,{title: title[0], description: title[1]});
    req.flash('success_msg','Note Updated Success');
    res.redirect('/notes');
})

router.delete('/notes/delete/:id',async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','Note Deleted Success');
    res.redirect('/notes')
})

module.exports = router;