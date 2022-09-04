const express = require('express');
const router = express.Router();
const Checklist = require('../models/checklist');

router.get('/', async(req, res) => {
    try{
        let checklists = await Checklist.find({})
        //res.status(200).json(checklists);
        res.status(200).render('checklists/index', {checklists: checklists});
    }catch (error) {
        //res.status(500).json(error)
        res.status(500).render('pages/error', {error: 'Erro ao exibir as listas.'});
    }
})

router.get('/new', async(req, res) => {
    try{
        let checklist = new Checklist();
        res.status(200).render('checklists/new', { checklist: checklist })
    } catch (error){
        res.status(500).render('pages/error', {error: 'Erro ao carregar o Formulario'})
    }
})

router.get('/edit', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.query.id);
        res.status(200).render('checklists/edit', {checklist: checklist});
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao exibir a edição de listas de tarefas.'});
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = new Checklist({name})
    try{
        await checklist.save();
        //let checklist = await Checklist.create({name})
        //res.status(200).json(checklist);
        res.redirect('/checklists')
    }catch (error) {
        //res.status(422).json(error)
        res.status(422).render('checklists/new', { checklists : {...checklist, error}});
    }
})

router.get('/id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.query.id).populate('tasks');
        //res.status(200).json(checklist);
        res.status(200).render('checklists/show', {checklist: checklist});
    } catch (error) {
        //res.status(422).json(error)
        res.status(500).render('pages/error', {error: 'Erro ao exibir as listas de tarefas.'});
    }
})

router.put('/edit/id', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = await Checklist.findById(req.query.id);
    //let checklist = await Checklist.findById(req.params.id);
    
    try {
        //let checklist = await Checklist.findByIdAndUpdate(req.query.id, {name}, {new: true});
        await checklist.update({name});
        //res.status(200).json(checklist);
        res.redirect('/checklists')
    } catch (error) {
        //res.status(422).json(error)
        error = error.errors;
        res.status(422).render('checklist/edit', {checklist: {...checklist, error}})
    }
})

router.delete('/id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndRemove(req.query.id);
        //res.status(200).json(checklist);
        res.redirect('/checklists')
    } catch (error) {
        //res.status(422).json(error)
        res.status(500).render('pages/error', {error: 'Erro ao deletar a lista de tarefas.'});
    }
})

module.exports = router