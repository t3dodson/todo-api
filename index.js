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
    const ObjectId = Schema.ObjectId;
    
    const TodoSchema = new Schema({
        description: String,
        done: Boolean
    });
    const Todo = mongoose.model('Todo', TodoSchema);
    return Todo;
};

setupDb().then(Todo => {
    app.post('/todo', (req, res) => {
        console.log('Got body:', req.body);
        const { description } = req.body;
        //const todo = new Todo();
        //todo.description = 'hello world';
        //todo.done = false;
        //todo.save();
        res.json(description);
    });

    app.put('/todo', (req, res) => {

    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});