require('dotenv').config();
const Person = require('./models/person');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// morgan middleware
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// error handling middleware

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// routes

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => res.json(204).end())
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;
  console.log(`${name} ${number}`);

  if (!name) {
    return res.status(400).json({ error: 'name missing' });
  }

  if (!number) {
    return res.status(400).json({ error: 'number missing' });
  }
  const newPerson = new Person({ name, number });
  newPerson
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const updatedPerson = req.body;
  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people.<br><br>${new Date()}`);
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
