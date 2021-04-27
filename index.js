const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Morgan token
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.json(204).end();
});

app.post('/api/persons', (req, res) => {
  const randomInt = (max) => Math.floor(Math.random() * max);
  let person = req.body;

  if (!person.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  if (!person.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  if (persons.find((another) => another.name === person.name)) {
    return res.status(400).json({
      error: 'name must be uniques',
    });
  }

  person = { ...person, id: randomInt(10000) };
  persons = persons.concat(person);
  res.json(person);
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people.<br><br>${new Date()}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
