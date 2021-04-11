const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const setupDb = async () => {
    await mongoose.connect('mongodb://admin:pass@mongo/todo?authSource=admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    const Schema = mongoose.Schema;
    
    const TodoSchema = new Schema({
        description: String,
        done: Boolean
    });
    const Todo = mongoose.model('Todo', TodoSchema);
    return Todo;
};

setupDb().then(Todo => {
    app.get('/todo', async (req, res) => {
        const todos = await Todo.find({});
        return res.json({
            todos: todos.map(({ _id, description, done }) => ({
                id: _id,
                description,
                done
            }))
        });
    });
    
    app.post('/todo', (req, res) => {
        console.log('Got body:', req.body);
        const { description } = req.body;
        const todo = new Todo();
        todo.description = description;
        todo.done = false;
        todo.save();
        return res.status(201).end();
    });

    app.put('/todo/:id', async (req, res) => {
        const { id } = req.params;
        const { description, done } = req.body;
        await Todo.replaceOne({ _id: id }, { description, done });
        return res.status(200).end();
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});