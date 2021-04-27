require('dotenv').config();
const Person = require('./models/person');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const person = require('./models/person');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Morgan token
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id).then(() => res.json(204).end());
});

app.post('/api/persons', (req, res) => {
  const name = req.body.name;
  const number = req.body.number;
  console.log(`${name} ${number}`);

  if (!name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  if (!number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }
  const person = new Person({ name, number });
  person.save().then((result) => {
    res.json(result);
  });
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people.<br><br>${new Date()}`);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
