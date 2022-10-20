const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

morgan.token('body', req => {return JSON.stringify(req.body)})

app.use(cors())
app.use(express.json());
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()} </p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (
    persons
      .map((person) => person.name.toLowerCase())
      .includes(body.name.toLowerCase())
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = {
    id: Math.floor(Math.random() * (100 - 1) + 1),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
