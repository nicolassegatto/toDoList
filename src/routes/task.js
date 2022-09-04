const express = require('express');
const checklistDependentRoute = express.Router();
const simpleRouter = express.Router();
const Checklist = require('../models/checklist');
const Task = require('../models/task');

checklistDependentRoute.get('/tasks/new', async (req, res) => {
    try {
        let task = Task();
        res.status(200).render('tasks/new', { checklistId: req.query.id, task: task })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao carregar o Formulário.' });
    }
})

simpleRouter.delete('/id', async(req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.query.id);
        let checklist = await Checklist.findById(task.checklist);
        let taskToRemove = checklist.tasks.indexOf(task._id);
        checklist.tasks.splice(taskToRemove, 1);
        checklist.save();
        res.redirect(`/checklists/id?id=${checklist._id}`);
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao deletar a tarefa.' });
    }
})

checklistDependentRoute.post('/tasks/create', async (req, res) => {
    let { name } = req.body.task;
    let task = new Task({ name, checklist: req.query.id })

    try {
        await task.save();
        let checklist = await Checklist.findById(req.query.id);
        checklist.tasks.push(task);
        await checklist.save();
        //res.status(200).json(checklist);
        res.redirect(`/checklists/id?id=${req.query.id}`);
    } catch (error) {
        //res.status(500).json(error)
        error = error.errors
        res.status(422).render('tasks/new', { task: {...task, error}, checklistId: req.query.id});
    }
})

simpleRouter.put('/id', async(req, res) => {
    let task = await Task.findById(req.query.id);
    try {
        task.set(req.body.task);
        await task.save();
        res.status(200).json({ task });
    } catch (error) {
        error = error.errors
        res.status(422).json({task: {...error}});
    }
})

module.exports = { 
    checklistDependent: checklistDependentRoute,
    simple: simpleRouter
}