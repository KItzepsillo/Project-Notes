const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticaded } = require('../helpers/auth');

router.get('/notes/add', isAuthenticaded, (req,res)=>{
    res.render('notes/new-note');
})

router.post('/notes/new-note', isAuthenticaded, async(req,res)=>{
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
        newNote.user = req.user.id;
        await  newNote.save();
        req.flash('success_msg','Note Added Successfully');
        res.redirect('/notes');
    }
})

router.get('/notes', isAuthenticaded,  async (req,res)=>{
    await Note.find({user: req.user.id})
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

router.get('/notes/edit/:id', isAuthenticaded, async (req,res)=>{
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

router.put('/notes/edit-note/:id', isAuthenticaded, async (req,res)=>{
    const {title}  = req.body;   

    await Note.findByIdAndUpdate(req.params.id,{title: title[0], description: title[1]});
    req.flash('success_msg','Note Updated Success');
    res.redirect('/notes');
})

router.delete('/notes/delete/:id', isAuthenticaded, async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','Note Deleted Success');
    res.redirect('/notes')
})

module.exports = router;